const { pool } = require('../config/database');

class Cotizacion {
  static async create(cotizacionData) {
    const { usuario_id, servicio, descripcion } = cotizacionData;
    const [result] = await pool.execute(
      'INSERT INTO cotizaciones (usuario_id, servicio, descripcion) VALUES (?, ?, ?)',
      [usuario_id, servicio, descripcion]
    );
    return result;
  }

  static async findById(id) {
    const [rows] = await pool.execute(`
      SELECT c.*, u.nombre, u.correo 
      FROM cotizaciones c 
      JOIN usuarios u ON c.usuario_id = u.id 
      WHERE c.id = ?
    `, [id]);
    return rows[0];
  }

  static async findByUsuarioId(usuario_id) {
    const [rows] = await pool.execute(`
      SELECT * FROM cotizaciones WHERE usuario_id = ? ORDER BY fecha_creacion DESC
    `, [usuario_id]);
    return rows;
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT c.*, u.nombre, u.correo 
      FROM cotizaciones c 
      JOIN usuarios u ON c.usuario_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.estado) {
      query += ' AND c.estado = ?';
      params.push(filters.estado);
    }

    if (filters.usuario_id) {
      query += ' AND c.usuario_id = ?';
      params.push(filters.usuario_id);
    }

    if (filters.fecha_desde) {
      query += ' AND c.fecha_creacion >= ?';
      params.push(filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      query += ' AND c.fecha_creacion <= ?';
      params.push(filters.fecha_hasta);
    }

    query += ' ORDER BY c.fecha_creacion DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async updateById(id, cotizacionData) {
    const { servicio, descripcion } = cotizacionData;
    const [result] = await pool.execute(
      'UPDATE cotizaciones SET servicio = ?, descripcion = ? WHERE id = ?',
      [servicio, descripcion, id]
    );
    return result;
  }

  static async updateEstado(id, estado, observacion_admin = null) {
    const [result] = await pool.execute(
      'UPDATE cotizaciones SET estado = ?, observacion_admin = ? WHERE id = ?',
      [estado, observacion_admin, id]
    );
    return result;
  }

  static async deleteById(id) {
    const [result] = await pool.execute('DELETE FROM cotizaciones WHERE id = ?', [id]);
    return result;
  }

  static async getStats() {
    const [rows] = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
        SUM(CASE WHEN estado = 'en_revision' THEN 1 ELSE 0 END) as en_revision,
        SUM(CASE WHEN estado = 'aprobada' THEN 1 ELSE 0 END) as aprobadas,
        SUM(CASE WHEN estado = 'rechazada' THEN 1 ELSE 0 END) as rechazadas
      FROM cotizaciones
    `);
    return rows[0];
  }
}

module.exports = Cotizacion;
