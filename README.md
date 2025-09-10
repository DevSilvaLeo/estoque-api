Estoque API (Node.js + Express + Sequelize + MySQL)

Setup rápido
- Copie .env.example para .env e ajuste variáveis
- Crie o banco MySQL definido em DB_NAME
- Instale dependências: npm install
- Rode: npm start

Endpoints principais
- POST /api/auth/login
- POST /api/auth/register (somente ADMIN)
- CRUD /api/departments, /api/suppliers, /api/items (auth; regras por perfil)
- POST /api/transactions (entrada/saída)
- GET /api/transactions?itemId= (listar movimentos)

Perfis
- ADMIN: total
- MANAGER: cria/edita itens/dept/fornecedor e lança movimentos
- USER: leitura e lança movimentos



