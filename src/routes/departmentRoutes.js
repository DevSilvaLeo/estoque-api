const { Router } = require('express');
const { authenticate, authorize, ROLES } = require('../middlewares/auth');
const ctrl = require('../controllers/departmentController');

const router = Router();

router.use(authenticate);

router.get('/', ctrl.list);
router.post('/', authorize([ROLES.ADMIN, ROLES.MANAGER]), ctrl.create);
router.get('/:id', ctrl.getById);
router.put('/:id', authorize([ROLES.ADMIN, ROLES.MANAGER]), ctrl.update);
router.delete('/:id', authorize([ROLES.ADMIN]), ctrl.remove);

module.exports = router;



