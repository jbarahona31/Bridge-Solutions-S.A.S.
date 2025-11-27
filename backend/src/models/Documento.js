const { pool } = require('../config/database');

class Documento {
  static async create(documentoData) {
    const { cotizacion_id, usuario_id, archivo_url, tipo } = documentoData;
    const [result] = await pool.execute(
      'INSERT INTO documentos (cotizacion_id, usuario_id, archivo_url, tipo) VALUES (?, ?, ?, ?)',
      [cotizacion_id, usuario_id, archivo_url, tipo]
    );
    return result;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM documentos WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByCotizacionId(cotizacion_id) {
    const [rows] = await pool.execute('SELECT * FROM documentos WHERE cotizacion_id = ? ORDER BY fecha_subida DESC', [cotizacion_id]);
    return rows;
  }

  static async findByUsuarioId(usuario_id) {
    const [rows] = await pool.execute('SELECT * FROM documentos WHERE usuario_id = ? ORDER BY fecha_subida DESC', [usuario_id]);
    return rows;
  }

  static async deleteById(id) {
    const [result] = await pool.execute('DELETE FROM documentos WHERE id = ?', [id]);
    return result;
  }

  static async getAll() {
    const [rows] = await pool.execute(`
      SELECT d.*, c.servicio, u.nombre 
      FROM documentos d 
      JOIN cotizaciones c ON d.cotizacion_id = c.id 
      JOIN usuarios u ON d.usuario_id = u.id 
      ORDER BY d.fecha_subida DESC
    `);
    return rows;
  }
}

module.exports = Documento;
