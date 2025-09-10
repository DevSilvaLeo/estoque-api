const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const { ROLES } = require('../utils/roles');

class User extends Model {
  async checkPassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.senha);
  }
}

User.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(160), allowNull: false, unique: true, validate: { isEmail: true } },
    senha: { type: DataTypes.STRING(120), allowNull: false },
    perfil: { 
      type: DataTypes.ENUM(ROLES.ADMIN, ROLES.OPERADOR, ROLES.VISUALIZADOR), 
      allowNull: false, 
      defaultValue: ROLES.VISUALIZADOR 
    },
    ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    dataCadastro: { 
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: DataTypes.NOW 
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    hooks: {
      async beforeCreate(user) {
        if (user.changed('senha')) {
          const salt = await bcrypt.genSalt(10);
          user.senha = await bcrypt.hash(user.senha, salt);
        }
      },
      async beforeUpdate(user) {
        if (user.changed('senha')) {
          const salt = await bcrypt.genSalt(10);
          user.senha = await bcrypt.hash(user.senha, salt);
        }
      },
    },
  }
);

module.exports = User;



