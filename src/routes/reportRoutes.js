const { Router } = require('express');
const { authenticate } = require('../middlewares/auth');
const ctrl = require('../controllers/reportController');

const router = Router();

router.use(authenticate);

router.get('/general', ctrl.getGeneral);
router.get('/product/:id', ctrl.getByProduct);

module.exports = router;



