const sequelize = require('../connection')
const Sequelize = require('sequelize')

const Job = sequelize.define('job',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title:{
        type:Sequelize.DataTypes.STRING,
        allowNull: false,
        validate:{
            notNull:{
                msg: 'title is required'
            },
            notEmpty:{
                msg: 'title can\t be empty'
            },
            len: {
                args: [5,20],
                msg: 'title must be 5-20 letters'
            },
            letterSpace(value){
                if(! /^[a-zA-Z\s]*$/.test(value)){
                    throw new Error('title supports only letters and spaces');
                }
            },
        }
    },
    body:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate:{
            len: {
                args: [20,200],
                msg: 'body must be 20-200 letters'
            },
            notEmpty:{
                msg: 'body can\t be empty'
            },
            notNull:{
                msg: 'body is required'
            },
        }
    },
    requirements:{
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        get() {
            return this.getDataValue('requirements').split(',')
        },
        set(val) {
            this.setDataValue('requirements',Array(val).join(';'));
        },
        validate:{
            notNull:{
                msg: 'requirements field is required'
            },
            notEmpty:{
                msg: 'requirements can\t be empty'
            },
            length(val){
                const arr = val.split(',')
                arr.forEach(element => {
                   if(element.length < 5){
                        throw new Error("requirements length at least 5 digits");
                   }
                });
                return val
            }
        }
    },
    salary:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notNull:{
                msg: 'salary is required'
            },
            min:{
                args:[2000],
                msg: 'min salary is 2000 $'
            }
        }
    },
    gender:{
        type: Sequelize.ENUM('male', 'female','both'),
        allowNull: false,
        validate:{
            notNull:{
                msg:'gender is required'
            },
            isIn:{
                args:[['male', 'female','both']],
                msg: 'gender must be male, female or both'
            }
        }
    },
    type:{
        type: Sequelize.ENUM('part','full'),
        allowNull: false,
        validate:{
            notNull:{
                msg:'time type is required'
            },
            isIn:{
                args:[['part','full']],
                msg: 'time type must be full or part'
            }
        }
    },
    approved:{
        type:Sequelize.DataTypes.BOOLEAN,
        defaultValue:false
    }
})

module.exports = Job
