const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const cotizacionController = require('../controllers/cotizacionController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// User routes
router.post('/',
  authMiddleware,
  [
    body('servicio').notEmpty().withMessage('Servicio es requerido'),
    body('descripcion').notEmpty().withMessage('Descripción es requerida')
  ],
  validate,
  cotizacionController.createCotizacion
);

router.get('/mis-cotizaciones', authMiddleware, cotizacionController.getMyCotizaciones);

router.get('/:id', authMiddleware, cotizacionController.getCotizacionById);

router.put('/:id',
  authMiddleware,
  [
    body('servicio').notEmpty().withMessage('Servicio es requerido'),
    body('descripcion').notEmpty().withMessage('Descripción es requerida')
  ],
  validate,
  cotizacionController.updateCotizacion
);

router.delete('/:id', authMiddleware, cotizacionController.deleteCotizacion);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, cotizacionController.getAllCotizaciones);

router.get('/admin/stats', authMiddleware, adminMiddleware, cotizacionController.getCotizacionesStats);

router.patch('/:id/estado',
  authMiddleware,
  adminMiddleware,
  [
    body('estado').isIn(['pendiente', 'en_revision', 'aprobada', 'rechazada']).withMessage('Estado inválido')
  ],
  validate,
  cotizacionController.updateCotizacionEstado
);

module.exports = router;
