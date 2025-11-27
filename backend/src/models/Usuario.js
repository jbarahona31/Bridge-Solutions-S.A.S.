const { pool } = require('../config/database');

class Usuario {
  static async create(userData) {
    const { nombre_completo, email, usuario, contraseña_hash, rol = 'usuario' } = userData;
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nombre_completo, email, usuario, contraseña_hash, rol) VALUES (?, ?, ?, ?, ?)',
      [nombre_completo, email, usuario, contraseña_hash, rol]
    );
    return result;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0];
  }

  static async findByUsuario(usuario) {
    const [rows] = await pool.execute('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT id, nombre_completo, email, usuario, rol, fecha_registro FROM usuarios WHERE id = ?', [id]);
    return rows[0];
  }

  static async updateById(id, userData) {
    const { nombre_completo, email } = userData;
    const [result] = await pool.execute(
      'UPDATE usuarios SET nombre_completo = ?, email = ? WHERE id = ?',
      [nombre_completo, email, id]
    );
    return result;
  }

  static async updatePassword(id, contraseña_hash) {
    const [result] = await pool.execute(
      'UPDATE usuarios SET contraseña_hash = ? WHERE id = ?',
      [contraseña_hash, id]
    );
    return result;
  }

  static async getAll() {
    const [rows] = await pool.execute('SELECT id, nombre_completo, email, usuario, rol, fecha_registro FROM usuarios');
    return rows;
  }
}

module.exports = Usuario;
