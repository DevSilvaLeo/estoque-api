const { Router } = require('express');
const authRoutes = require('./authRoutes');
const itemRoutes = require('./itemRoutes');
const departmentRoutes = require('./departmentRoutes');
const supplierRoutes = require('./supplierRoutes');
const transactionRoutes = require('./transactionRoutes');
const reportRoutes = require('./reportRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/items', itemRoutes);
router.use('/departments', departmentRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/transactions', transactionRoutes);
router.use('/reports', reportRoutes);

module.exports = router;


