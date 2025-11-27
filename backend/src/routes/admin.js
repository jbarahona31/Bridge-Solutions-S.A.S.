const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/dashboard', authMiddleware, adminMiddleware, (req, res) => {
  // Return only safe user properties, excluding sensitive data
  const safeUser = {
    id: req.user.id,
    email: req.user.email,
    rol: req.user.rol
  };
  res.json({ message: 'Bienvenido al panel de administrador', usuario: safeUser });
});

module.exports = router;
