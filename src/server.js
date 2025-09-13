const app = require('./app');
const { sequelize } = require('./models');
const { ensureDatabase } = require('./config/database');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await ensureDatabase();
    await sequelize.authenticate();
    await sequelize.sync();
    // Bootstrap: ensure an admin user exists
    const { User } = require('./models');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@local';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    const admin = await User.findOne({ where: { email: adminEmail } });
    if (!admin) {
      await User.create({ nome: 'Admin', email: adminEmail, senha: adminPass, perfil: 'ADMIN' });
      // eslint-disable-next-line no-console
      console.log('Admin user created:', adminEmail);
    }
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();


