const { Router } = require('express');
const { authenticate } = require('../middlewares/auth');
const { create, createValidators, list } = require('../controllers/transactionController');

const router = Router();

router.use(authenticate);

router.get('/', list);
router.post('/', createValidators, create);

module.exports = router;



