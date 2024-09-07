'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt'); // Para manejar la validación de contraseñas

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Asociaciones (si las tienes)
    }

    // Método para actualizar el perfil
    updateProfile(newData) {
      this.name = newData.name;
      this.username = newData.username;
      this.email = newData.email;
      this.image = newData.image;
      this.rol = newData.rol;
      return this.save();
    }

    // Método para validar la contraseña
    passwordValid(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }
  
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    },
    timestamps: false, // Si no quieres los campos createdAt y updatedAt automáticos
  });
  
  return User;
};
