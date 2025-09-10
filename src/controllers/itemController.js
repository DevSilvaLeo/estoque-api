const { Item, Department, Supplier } = require('../models');

async function create(req, res) {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function list(req, res) {
  const rows = await Item.findAll({
    include: [
      { model: Department, attributes: ['id', 'name'] },
      { model: Supplier, attributes: ['id', 'name'] },
    ],
    order: [['name', 'ASC']],
  });
  res.json(rows);
}

async function getById(req, res) {
  const row = await Item.findByPk(req.params.id, {
    include: [
      { model: Department, attributes: ['id', 'name'] },
      { model: Supplier, attributes: ['id', 'name'] },
    ],
  });
  if (!row) return res.status(404).json({ message: 'Não encontrado' });
  res.json(row);
}

async function update(req, res) {
  const row = await Item.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Não encontrado' });
  await row.update(req.body);
  res.json(row);
}

async function remove(req, res) {
  const row = await Item.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Não encontrado' });
  await row.destroy();
  res.status(204).end();
}

module.exports = { create, list, getById, update, remove };



