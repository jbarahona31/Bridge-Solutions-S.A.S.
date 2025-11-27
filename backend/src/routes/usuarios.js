const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const usuarios = await Usuario.getAll();
    res.json({ usuarios });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Get user by ID (admin only)
router.get('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ usuario });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
});

module.exports = router;
