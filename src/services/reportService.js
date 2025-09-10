const { Op } = require('sequelize');
const { Item, Transaction, User } = require('../models');

async function generalReport({ startDate, endDate }) {
  const where = {};
  if (startDate || endDate) {
    where.when = {};
    if (startDate) where.when[Op.gte] = new Date(startDate);
    if (endDate) where.when[Op.lte] = new Date(endDate);
  }
  const rows = await Transaction.findAll({
    where,
    include: [
      { model: Item, attributes: ['id', 'name'] },
      { model: User, as: 'performedBy', attributes: ['id', 'name'] },
    ],
    order: [['when', 'DESC']],
  });
  return rows;
}

async function productReport(itemId, { startDate, endDate }) {
  return generalReport({ startDate, endDate, itemId });
}

module.exports = { generalReport, productReport };



