const { Router } = require('express');
const { register, registerValidators, login, loginValidators } = require('../controllers/authController');
const { authenticate, authorize, ROLES } = require('../middlewares/auth');

const router = Router();

router.post('/register', authenticate, authorize([ROLES.ADMIN]), registerValidators, register);
router.post('/login', loginValidators, login);

module.exports = router;



