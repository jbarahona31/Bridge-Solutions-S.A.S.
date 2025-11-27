const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/dashboard', authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: 'Bienvenido al panel de administrador', usuario: req.user });
});

module.exports = router;
