const sequelize = require('../connection')
const Sequelize = require('sequelize')

const Category = sequelize.define('category',{
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
            len: {
                args: [3,10],
                msg: 'title must be 3-10 letters'
            },
            letterSpace(value){
                if(! /^[a-zA-Z\s]*$/.test(value)){
                    throw new Error('title supports only letters and spaces');
                }
            },
            notNull:{
                msg: 'title is required'
            },
            notEmpty:{
                msg: 'title can\t be empty'
            }
        }
    },
})
module.exports = Category