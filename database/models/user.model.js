const sequelize = require('../connection')
const { Model,DataTypes,STRING,INTEGER,BOOLEAN } = require("sequelize");
const {compare} = require('bcryptjs')
const {sign,verify} = require('jsonwebtoken')
const {hashPassword} = require('../../helpers/helpers')

class User extends Model{}
User.init({
    id:{
        type: INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email:{
        type: STRING,
        unique: true,
        allowNull: false,
        validate:{
            isEmail:{
                msg:'invalid email format'
            },
            notEmpty:{
                msg: 'email can\t be empty'
            },
            notNull:{
                msg: 'email is required'
            },
        }
    },
    password:{
        type: DataTypes.TEXT,
        allowNull: false,
        validate:{
            notEmpty:{
                msg: 'password can\t be empty'
            },
            len:{
                args: [8,25],
                msg: 'password must be from 8 to 25 digits'
            },
            notNull:{
                msg: 'password is required'
            },
        }
    },
    admin:{
        type: BOOLEAN,
        defaultValue: false
    },
    firstName:{
        type: STRING,
        allowNull: false,
        validate:{
            isAlpha:{
                msg: 'first name supports only letters'
            },
            len: {
                args: [3,25],
                msg: 'first name must be 3-25 letters'
            },
            notEmpty:{
                msg: 'first name can\t be empty'
            },
            notNull:{
                msg: 'first name is required'
            },
        }
    },
    lastName:{
        type: STRING,
        allowNull: false,
        validate:{
            isAlpha:{
                msg: 'last name supports only letters'
            },
            len: {
                args: [3,25],
                msg: 'last name must be 3-25 letters'
            },
            notEmpty:{
                msg: 'last name can\t be empty'
            },
            notNull:{
                msg: 'last name is required'
            },
        }
    },
    fullName: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.firstName} ${this.lastName}`;
        },
        set(value) {
            throw new Error('Do not try to set `fullName` value');
        }
    },
    age:{
        type: INTEGER,
        validate:{
            max: {
                args:[80],
                msg:'max age is 80'
            },
            min: {
                args:[18],
                msg:'min age is 18'
            },
            isInt:{
                msg: 'age supports numbers only'
            }
        }
    },
    avatar:{
        type: STRING
    }
},{sequelize})

User.prototype.toJSON =  function () {
    var user = Object.assign({}, this.get());
    delete user.password;
    return user;
}
User.prototype.generateToken = async function(){
    const token = await sign({id:this.id,email:this.email,admin:this.admin},process.env.SECRET_KEY)
    return token
}
User.prototype.comparePassword = async function(password){
    return await compare(password,this.password)
}
User.findByToken = async function(token){
        const {id} = await verify(token,process.env.SECRET_KEY)
        const user = await this.findOne({where:{id}})
        return user
}
// User.beforeCreate(async (user, options) => {
//     const hashed = await hashPassword(user.password,5)
//     user.password = hashed;
// });
User.afterValidate('myHookAfter', async(user, options) => {
    const hashed = await hashPassword(user.password,5)
    user.password = hashed;
  });
// User.beforeUpdate(async (user, options) => {
//     console.log(user)
//     if(user.dataValues.password !== user._previousDataValues.password){
        
//     }
// });

module.exports = User
