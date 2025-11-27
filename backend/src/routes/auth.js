const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Register
router.post('/register',
  [
    body('nombre').notEmpty().withMessage('Nombre es requerido'),
    body('correo').isEmail().withMessage('Correo válido es requerido'),
    body('usuario').isLength({ min: 4 }).withMessage('Usuario debe tener al menos 4 caracteres'),
    body('contraseña').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres')
  ],
  validate,
  authController.register
);

// Login
router.post('/login',
  [
    body('correo').isEmail().withMessage('Correo válido es requerido'),
    body('contraseña').notEmpty().withMessage('Contraseña es requerida')
  ],
  validate,
  authController.login
);

// Get profile (protected)
router.get('/profile', authMiddleware, authController.getProfile);

// Update profile (protected)
router.put('/profile',
  authMiddleware,
  [
    body('nombre').notEmpty().withMessage('Nombre es requerido'),
    body('correo').isEmail().withMessage('Correo válido es requerido')
  ],
  validate,
  authController.updateProfile
);

// Change password (protected)
router.put('/change-password',
  authMiddleware,
  [
    body('contraseña_actual').notEmpty().withMessage('Contraseña actual es requerida'),
    body('contraseña_nueva').isLength({ min: 6 }).withMessage('Nueva contraseña debe tener al menos 6 caracteres')
  ],
  validate,
  authController.changePassword
);

module.exports = router;
