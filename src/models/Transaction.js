const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

const TIPO_MOVIMENTACAO = { 
  ENTRADA: 'ENTRADA', 
  SAIDA: 'SAIDA' 
};

class Transaction extends Model {}

Transaction.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    itemId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    itemNome: { type: DataTypes.STRING(200), allowNull: false },
    tipo: { 
      type: DataTypes.ENUM(Object.values(TIPO_MOVIMENTACAO)), 
      allowNull: false 
    },
    quantidade: { type: DataTypes.INTEGER, allowNull: false },
    data: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    responsavel: { type: DataTypes.STRING(120), allowNull: false },
    observacoes: { type: DataTypes.STRING(255), allowNull: true },
    valorUnitario: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    valorTotal: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    performedByUserId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  { sequelize, tableName: 'transactions', modelName: 'Transaction' }
);

Transaction.TIPO_MOVIMENTACAO = TIPO_MOVIMENTACAO;

module.exports = Transaction;



