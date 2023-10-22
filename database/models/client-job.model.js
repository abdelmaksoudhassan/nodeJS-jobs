const Sequelize = require('sequelize');
const sequelize = require('../connection');

const UserJob = sequelize.define('user_job', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = UserJob;