const Cotizacion = require('../models/Cotizacion');
const Documento = require('../models/Documento');

const createCotizacion = async (req, res) => {
  try {
    const { servicio, descripcion } = req.body;

    const result = await Cotizacion.create({
      usuario_id: req.user.id,
      servicio,
      descripcion
    });

    const cotizacion = await Cotizacion.findById(result.insertId);

    res.status(201).json({
      message: 'Cotización creada exitosamente',
      cotizacion
    });
  } catch (error) {
    console.error('Create cotizacion error:', error);
    res.status(500).json({ message: 'Error al crear cotización' });
  }
};

const getMyCotizaciones = async (req, res) => {
  try {
    const cotizaciones = await Cotizacion.findByUsuarioId(req.user.id);

    // Get documents for each cotizacion
    const cotizacionesWithDocs = await Promise.all(
      cotizaciones.map(async (cot) => {
        const documentos = await Documento.findByCotizacionId(cot.id);
        return { ...cot, documentos };
      })
    );

    res.json({ cotizaciones: cotizacionesWithDocs });
  } catch (error) {
    console.error('Get my cotizaciones error:', error);
    res.status(500).json({ message: 'Error al obtener cotizaciones' });
  }
};

const getCotizacionById = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);

    if (!cotizacion) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }

    // Check if user owns this cotizacion or is admin
    if (cotizacion.usuario_id !== req.user.id && req.user.rol !== 'administrador') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const documentos = await Documento.findByCotizacionId(cotizacion.id);

    res.json({ cotizacion: { ...cotizacion, documentos } });
  } catch (error) {
    console.error('Get cotizacion error:', error);
    res.status(500).json({ message: 'Error al obtener cotización' });
  }
};

const updateCotizacion = async (req, res) => {
  try {
    const { servicio, descripcion } = req.body;
    const cotizacion = await Cotizacion.findById(req.params.id);

    if (!cotizacion) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }

    // Check if user owns this cotizacion
    if (cotizacion.usuario_id !== req.user.id) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    // Only allow editing if status is 'pendiente'
    if (cotizacion.estado !== 'pendiente') {
      return res.status(400).json({ message: 'Solo se pueden editar cotizaciones en estado pendiente' });
    }

    await Cotizacion.updateById(req.params.id, { servicio, descripcion });
    const updatedCotizacion = await Cotizacion.findById(req.params.id);

    res.json({
      message: 'Cotización actualizada exitosamente',
      cotizacion: updatedCotizacion
    });
  } catch (error) {
    console.error('Update cotizacion error:', error);
    res.status(500).json({ message: 'Error al actualizar cotización' });
  }
};

const deleteCotizacion = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);

    if (!cotizacion) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }

    // Check if user owns this cotizacion
    if (cotizacion.usuario_id !== req.user.id) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    // Only allow deletion if status is 'pendiente'
    if (cotizacion.estado !== 'pendiente') {
      return res.status(400).json({ message: 'Solo se pueden eliminar cotizaciones en estado pendiente' });
    }

    await Cotizacion.deleteById(req.params.id);

    res.json({ message: 'Cotización eliminada exitosamente' });
  } catch (error) {
    console.error('Delete cotizacion error:', error);
    res.status(500).json({ message: 'Error al eliminar cotización' });
  }
};

// Admin functions
const getAllCotizaciones = async (req, res) => {
  try {
    const { estado, usuario_id, fecha_desde, fecha_hasta } = req.query;
    const filters = {};

    if (estado) filters.estado = estado;
    if (usuario_id) filters.usuario_id = usuario_id;
    if (fecha_desde) filters.fecha_desde = fecha_desde;
    if (fecha_hasta) filters.fecha_hasta = fecha_hasta;

    const cotizaciones = await Cotizacion.getAll(filters);

    // Get documents for each cotizacion
    const cotizacionesWithDocs = await Promise.all(
      cotizaciones.map(async (cot) => {
        const documentos = await Documento.findByCotizacionId(cot.id);
        return { ...cot, documentos };
      })
    );

    res.json({ cotizaciones: cotizacionesWithDocs });
  } catch (error) {
    console.error('Get all cotizaciones error:', error);
    res.status(500).json({ message: 'Error al obtener cotizaciones' });
  }
};

const updateCotizacionEstado = async (req, res) => {
  try {
    const { estado, observacion_admin } = req.body;
    const cotizacion = await Cotizacion.findById(req.params.id);

    if (!cotizacion) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }

    await Cotizacion.updateEstado(req.params.id, estado, observacion_admin);
    const updatedCotizacion = await Cotizacion.findById(req.params.id);

    res.json({
      message: 'Estado de cotización actualizado exitosamente',
      cotizacion: updatedCotizacion
    });
  } catch (error) {
    console.error('Update cotizacion estado error:', error);
    res.status(500).json({ message: 'Error al actualizar estado de cotización' });
  }
};

const getCotizacionesStats = async (req, res) => {
  try {
    const stats = await Cotizacion.getStats();
    res.json({ stats });
  } catch (error) {
    console.error('Get cotizaciones stats error:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};

module.exports = {
  createCotizacion,
  getMyCotizaciones,
  getCotizacionById,
  updateCotizacion,
  deleteCotizacion,
  getAllCotizaciones,
  updateCotizacionEstado,
  getCotizacionesStats
};
