const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Supplier extends Model {}

Supplier.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(160), allowNull: false },
    contato: { type: DataTypes.STRING(120), allowNull: true },
    telefone: { type: DataTypes.STRING(40), allowNull: true },
    email: { type: DataTypes.STRING(160), allowNull: true, validate: { isEmail: true } },
  },
  { sequelize, tableName: 'suppliers', modelName: 'Supplier' }
);

module.exports = Supplier;



