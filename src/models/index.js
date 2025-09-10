const { sequelize } = require('../config/database');
const User = require('./User');
const Department = require('./Department');
const Supplier = require('./Supplier');
const Item = require('./Item');
const Transaction = require('./Transaction');

// Associations
Department.hasMany(Item, { foreignKey: 'departamentoId', as: 'itens' });
Item.belongsTo(Department, { foreignKey: 'departamentoId', as: 'departamento' });

Supplier.hasMany(Item, { foreignKey: 'fornecedorId', as: 'itens' });
Item.belongsTo(Supplier, { foreignKey: 'fornecedorId', as: 'fornecedor' });

User.hasMany(Transaction, { foreignKey: 'performedByUserId', as: 'movimentacoes' });
Transaction.belongsTo(User, { foreignKey: 'performedByUserId', as: 'usuario' });

Item.hasMany(Transaction, { foreignKey: 'itemId', as: 'movimentacoes' });
Transaction.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

module.exports = {
  sequelize,
  User,
  Department,
  Supplier,
  Item,
  Transaction,
};



