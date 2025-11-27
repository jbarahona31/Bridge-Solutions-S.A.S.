const path = require('path');
const fs = require('fs');
const Documento = require('../models/Documento');
const Cotizacion = require('../models/Cotizacion');

const uploadDocumento = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }

    const { cotizacion_id, tipo } = req.body;

    // Verify cotizacion exists and belongs to user
    const cotizacion = await Cotizacion.findById(cotizacion_id);
    if (!cotizacion) {
      // Delete uploaded file if cotizacion doesn't exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }

    if (cotizacion.usuario_id !== req.user.id && req.user.rol !== 'administrador') {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const archivo_url = `/uploads/${req.file.filename}`;

    const result = await Documento.create({
      cotizacion_id,
      usuario_id: req.user.id,
      archivo_url,
      tipo: tipo || req.file.mimetype
    });

    const documento = await Documento.findById(result.insertId);

    res.status(201).json({
      message: 'Documento subido exitosamente',
      documento
    });
  } catch (error) {
    console.error('Upload documento error:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Error al subir documento' });
  }
};

const getMyDocumentos = async (req, res) => {
  try {
    const documentos = await Documento.findByUsuarioId(req.user.id);
    res.json({ documentos });
  } catch (error) {
    console.error('Get my documentos error:', error);
    res.status(500).json({ message: 'Error al obtener documentos' });
  }
};

const getDocumentosByCotizacion = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.cotizacionId);

    if (!cotizacion) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }

    // Check if user owns this cotizacion or is admin
    if (cotizacion.usuario_id !== req.user.id && req.user.rol !== 'administrador') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const documentos = await Documento.findByCotizacionId(req.params.cotizacionId);
    res.json({ documentos });
  } catch (error) {
    console.error('Get documentos by cotizacion error:', error);
    res.status(500).json({ message: 'Error al obtener documentos' });
  }
};

const deleteDocumento = async (req, res) => {
  try {
    const documento = await Documento.findById(req.params.id);

    if (!documento) {
      return res.status(404).json({ message: 'Documento no encontrado' });
    }

    // Check if user owns this documento or is admin
    if (documento.usuario_id !== req.user.id && req.user.rol !== 'administrador') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '../../', documento.archivo_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Documento.deleteById(req.params.id);

    res.json({ message: 'Documento eliminado exitosamente' });
  } catch (error) {
    console.error('Delete documento error:', error);
    res.status(500).json({ message: 'Error al eliminar documento' });
  }
};

// Admin function
const getAllDocumentos = async (req, res) => {
  try {
    const documentos = await Documento.getAll();
    res.json({ documentos });
  } catch (error) {
    console.error('Get all documentos error:', error);
    res.status(500).json({ message: 'Error al obtener documentos' });
  }
};

module.exports = {
  uploadDocumento,
  getMyDocumentos,
  getDocumentosByCotizacion,
  deleteDocumento,
  getAllDocumentos
};
