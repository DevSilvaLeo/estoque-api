const { Router } = require('express');
const { 
  create, 
  createValidators,
  list, 
  getById, 
  update, 
  updateValidators,
  remove 
} = require('../controllers/userController');
const { authenticate, authorize, ROLES } = require('../middlewares/auth');

const router = Router();

// Todas as rotas de usuários requerem autenticação e perfil ADMIN
router.use(authenticate);
router.use(authorize([ROLES.ADMIN]));

// CRUD de usuários
router.post('/', createValidators, create);           // POST /users - Criar usuário
router.get('/', list);                                // GET /users - Listar usuários
router.get('/:id', getById);                          // GET /users/:id - Buscar usuário por ID
router.put('/:id', updateValidators, update);         // PUT /users/:id - Atualizar usuário
router.delete('/:id', remove);                        // DELETE /users/:id - Deletar usuário

module.exports = router;
