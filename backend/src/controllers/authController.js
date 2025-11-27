const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const config = require('../config');

const register = async (req, res) => {
  try {
    const { nombre_completo, email, usuario, contraseña, rol } = req.body;

    // Check if email already exists
    const existingEmail = await Usuario.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Check if username already exists
    const existingUsuario = await Usuario.findByUsuario(usuario);
    if (existingUsuario) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const contraseña_hash = await bcrypt.hash(contraseña, salt);

    // Create user
    const result = await Usuario.create({
      nombre_completo,
      email,
      usuario,
      contraseña_hash,
      rol: rol || 'usuario'
    });

    // Get created user
    const newUser = await Usuario.findById(result.insertId);

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, rol: newUser.rol },
      config.jwt.secret,
      { expiresIn: config.jwt.expire }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: newUser,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

const login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    // Find user by email
    const user = await Usuario.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(contraseña, user.contraseña_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      config.jwt.secret,
      { expiresIn: config.jwt.expire }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre_completo,
        correo: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await Usuario.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { nombre_completo, email } = req.body;

    // Check if email is already used by another user
    const existingEmail = await Usuario.findByEmail(email);
    if (existingEmail && existingEmail.id !== req.user.id) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
    }

    await Usuario.updateById(req.user.id, { nombre_completo, email });
    const updatedUser = await Usuario.findById(req.user.id);

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { contraseña_actual, contraseña_nueva } = req.body;

    // Get current user with password
    const user = await Usuario.findByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(contraseña_actual, user.contraseña_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña actual incorrecta' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const contraseña_hash = await bcrypt.hash(contraseña_nueva, salt);

    await Usuario.updatePassword(req.user.id, contraseña_hash);

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Error al cambiar contraseña' });
  }
};

module.exports = { register, login, getProfile, updateProfile, changePassword };
