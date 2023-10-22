const sequelize = require('../connection')
const Sequelize = require('sequelize')

class ExtraData extends Sequelize.Model{}
ExtraData.init({
    id:{
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    specialty:{
        type:Sequelize.DataTypes.STRING,
        allowNull: false,
        len: {
            args: [3,10],
            msg: 'this field must be 3-10 letters'
        },
        notNull:{
            msg: 'specialty is required'
        },
        notEmpty:{
            msg: 'specialty can\t be empty'
        },
    },
    cv:{
        type:Sequelize.DataTypes.STRING
    }
},{sequelize})
module.exports = ExtraData