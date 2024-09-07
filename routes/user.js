const express = require('express');
const router = express.Router();
const { User } = require('../models');  // Asegúrate de que la ruta a tu modelo es correcta
const bcrypt = require('bcrypt');

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password, image, rol } = req.body;

    // Validar si el usuario o el email ya existe
    const userExists = await User.findOne({ where: { username } });
    const emailExists = await User.findOne({ where: { email } });

    if (userExists || emailExists) {
      return res.status(400).json({ error: 'Usuario o correo ya existe' });
    }

    // Crear el nuevo usuario
    const newUser = await User.create({
      name,
      username,
      email,
      password,  // Sequelize automáticamente va a hashear la contraseña si usaste los hooks
      image,
      rol,
    });

    res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Error al registrar usuario' ,details: error.message});
  }
});
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Verificar si el usuario existe
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: 'Usuario no encontrado' });
      }
  
      // Validar la contraseña
      const validPassword = user.passwordValid(password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
      }
  
      // Si todo está bien, devolver éxito
      res.status(200).json({ message: 'Login exitoso', user });
    } catch (error) {
      res.status(500).json({ error: 'Error en la autenticación' });
    }
  });
  // Ruta para obtener todos los usuarios
router.get('/all', async (req, res) => {
    try {
      const users = await User.findAll();  // Recuperar todos los usuarios
      res.status(200).json(users);  // Devolver los usuarios en formato JSON
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  });
  router.delete('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      await user.destroy();
      res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar usuario', details: error.message });
    }
  });
  

  

module.exports = router;
