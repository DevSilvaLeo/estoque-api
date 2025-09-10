const { body, validationResult } = require('express-validator');
const { Item, Transaction, User } = require('../models');

const createValidators = [
  body('itemId').isInt({ gt: 0 }),
  body('quantidade').isInt({ gt: 0 }),
  body('tipo').isIn(Object.values(Transaction.TIPO_MOVIMENTACAO)),
  body('data').optional().isISO8601(),
  body('observacoes').optional().isString(),
  body('responsavel').isString().notEmpty(),
  body('valorUnitario').optional().isDecimal(),
  body('valorTotal').optional().isDecimal(),
];

async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { itemId, quantidade, tipo, data, observacoes, responsavel, valorUnitario, valorTotal } = req.body;
  const item = await Item.findByPk(itemId);
  if (!item) return res.status(404).json({ message: 'Item não encontrado' });

  const t = await Item.sequelize.transaction();
  try {
    const trx = await Transaction.create(
      {
        itemId,
        itemNome: item.nome,
        quantidade,
        tipo,
        data: data || new Date(),
        responsavel,
        observacoes: observacoes || null,
        valorUnitario: valorUnitario || null,
        valorTotal: valorTotal || null,
        performedByUserId: req.user.id,
      },
      { transaction: t }
    );

    if (tipo === Transaction.TIPO_MOVIMENTACAO.ENTRADA) {
      item.quantidadeAtual += quantidade;
    } else {
      if (item.quantidadeAtual < quantidade) throw new Error('Quantidade insuficiente em estoque');
      item.quantidadeAtual -= quantidade;
    }
    await item.save({ transaction: t });
    await t.commit();
    res.status(201).json(trx);
  } catch (err) {
    await t.rollback();
    res.status(400).json({ message: err.message });
  }
}

async function list(req, res) {
  const { itemId, startDate, endDate } = req.query;
  const where = {};
  if (itemId) where.itemId = itemId;
  if (startDate || endDate) {
    const { Op } = require('sequelize');
    where.data = {};
    if (startDate) where.data[Op.gte] = new Date(startDate);
    if (endDate) where.data[Op.lte] = new Date(endDate);
  }
  const rows = await Transaction.findAll({
    where,
    include: [
      { model: Item, as: 'item', attributes: ['id', 'nome'] },
      { model: User, as: 'usuario', attributes: ['id', 'nome', 'email'] },
    ],
    order: [['data', 'DESC']],
  });
  res.json(rows);
}

module.exports = { create, createValidators, list };


