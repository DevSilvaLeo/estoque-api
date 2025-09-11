const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { ROLES } = require('../utils/roles');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

const registerValidators = [
  body('nome').notEmpty(),
  body('email').isEmail(),
  body('senha').isLength({ min: 6 }),
  body('perfil').optional().isIn(Object.values(ROLES)),
];

async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { nome, email, senha, perfil = ROLES.VISUALIZADOR } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email já cadastrado' });
    const user = await User.create({ nome, email, senha, perfil });
    return res.status(201).json({ id: user.id, nome: user.nome, email: user.email, perfil: user.perfil });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao registrar', error: err.message });
  }
}

const loginValidators = [
  body('email').isEmail(),
  body('senha').notEmpty(),
];

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });
    const ok = await user.checkPassword(senha);
    if (!ok) return res.status(401).json({ message: 'Credenciais inválidas' });
    const token = jwt.sign({ id: user.id, email: user.email, perfil: user.perfil }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.json({ token, usuario: { id: user.id, nome: user.nome, email: user.email, perfil: user.perfil } });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao autenticar', error: err.message });
  }
}

module.exports = { register, registerValidators, login, loginValidators };



