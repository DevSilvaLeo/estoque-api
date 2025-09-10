const { generalReport, productReport } = require('../services/reportService');

async function getGeneral(req, res) {
  try {
    const { startDate, endDate } = req.query;
    const data = await generalReport({ startDate, endDate });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getByProduct(req, res) {
  try {
    const { startDate, endDate } = req.query;
    const { id } = req.params;
    const data = await productReport(id, { startDate, endDate });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getGeneral, getByProduct };



