const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { ROLES } = require('../utils/roles');

const createValidators = [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email deve ser válido'),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('perfil').optional().isIn(Object.values(ROLES)).withMessage('Perfil deve ser ADMIN, OPERADOR ou VISUALIZADOR'),
];

const updateValidators = [
  body('nome').optional().notEmpty().withMessage('Nome não pode ser vazio'),
  body('email').optional().isEmail().withMessage('Email deve ser válido'),
  body('senha').optional().isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('perfil').optional().isIn(Object.values(ROLES)).withMessage('Perfil deve ser ADMIN, OPERADOR ou VISUALIZADOR'),
  body('ativo').optional().isBoolean().withMessage('Ativo deve ser true ou false'),
];

async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { nome, email, senha, perfil = ROLES.VISUALIZADOR } = req.body;
    
    // Verificar se email já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }

    const user = await User.create({
      nome,
      email,
      senha,
      perfil
    });

    // Retornar dados sem a senha
    const { senha: _, ...userData } = user.toJSON();
    res.status(201).json(userData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function list(req, res) {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['senha'] }, // Excluir senha do resultado
      order: [['nome', 'ASC']],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error: err.message });
  }
}

async function getById(req, res) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['senha'] }, // Excluir senha do resultado
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar usuário', error: err.message });
  }
}

async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const { nome, email, senha, perfil, ativo } = req.body;
    
    // Verificar se email já existe em outro usuário
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ 
        where: { 
          email,
          id: { [require('sequelize').Op.ne]: user.id }
        } 
      });
      if (existingUser) {
        return res.status(409).json({ message: 'Email já cadastrado' });
      }
    }

    // Atualizar apenas os campos fornecidos
    const updateData = {};
    if (nome !== undefined) updateData.nome = nome;
    if (email !== undefined) updateData.email = email;
    if (senha !== undefined) updateData.senha = senha;
    if (perfil !== undefined) updateData.perfil = perfil;
    if (ativo !== undefined) updateData.ativo = ativo;

    await user.update(updateData);

    // Retornar dados atualizados sem a senha
    const { senha: _, ...userData } = user.toJSON();
    res.json(userData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function remove(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar se o usuário está tentando deletar a si mesmo
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Não é possível deletar seu próprio usuário' });
    }

    await user.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar usuário', error: err.message });
  }
}

module.exports = { 
  create, 
  createValidators,
  list, 
  getById, 
  update, 
  updateValidators,
  remove 
};
