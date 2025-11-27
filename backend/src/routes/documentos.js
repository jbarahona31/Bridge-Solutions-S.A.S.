const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const documentoController = require('../controllers/documentoController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

// User routes
router.post('/upload',
  authMiddleware,
  upload.single('archivo'),
  documentoController.uploadDocumento
);

router.get('/mis-documentos', authMiddleware, documentoController.getMyDocumentos);

router.get('/cotizacion/:cotizacionId', authMiddleware, documentoController.getDocumentosByCotizacion);

router.delete('/:id', authMiddleware, documentoController.deleteDocumento);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, documentoController.getAllDocumentos);

module.exports = router;
