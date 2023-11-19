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
    cv:{
        type:Sequelize.DataTypes.STRING
    }
},{sequelize})
module.exports = ExtraData
