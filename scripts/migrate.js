const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASS = '',
  DB_NAME = 'estoque',
} = process.env;

async function runMigration() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    multipleStatements: true
  });

  try {
    console.log('Executando migração...');
    
    // Ler o arquivo de migração
    const migrationPath = path.join(__dirname, '..', 'migrations', '001_rename_columns.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Executar a migração
    await connection.execute(migrationSQL);
    
    console.log('Migração executada com sucesso!');
  } catch (error) {
    console.error('Erro ao executar migração:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('Migração concluída!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Falha na migração:', error);
      process.exit(1);
    });
}

module.exports = { runMigration };
