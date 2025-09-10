const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Department extends Model {}

Department.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    descricao: { type: DataTypes.STRING(255), allowNull: true },
  },
  { sequelize, tableName: 'departments', modelName: 'Department' }
);

module.exports = Department;



