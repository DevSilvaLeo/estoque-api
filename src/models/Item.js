const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

const TIPO_ITEM = {
  PRODUTO: 'PRODUTO',
  MATERIAL: 'MATERIAL',
  EQUIPAMENTO: 'EQUIPAMENTO',
  FERRAMENTA: 'FERRAMENTA',
  OUTROS: 'OUTROS'
};

class Item extends Model {}

Item.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(200), allowNull: false },
    departamentoId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    fornecedorId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    valorUnitario: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    validade: { type: DataTypes.DATEONLY, allowNull: true },
    restricoes: { type: DataTypes.STRING(255), allowNull: true },
    tipoItem: { 
      type: DataTypes.ENUM(Object.values(TIPO_ITEM)), 
      allowNull: false,
      defaultValue: TIPO_ITEM.OUTROS
    },
    quantidadeAtual: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    dataCadastro: { 
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: DataTypes.NOW 
    },
    ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { sequelize, tableName: 'items', modelName: 'Item' }
);

Item.TIPO_ITEM = TIPO_ITEM;

module.exports = Item;



