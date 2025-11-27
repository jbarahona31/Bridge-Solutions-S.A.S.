const { pool } = require('../config/database');

class Usuario {
  static async create(userData) {
    const { nombre, correo, usuario, contraseña_hash, rol = 'usuario' } = userData;
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nombre, correo, usuario, contraseña_hash, rol) VALUES (?, ?, ?, ?, ?)',
      [nombre, correo, usuario, contraseña_hash, rol]
    );
    return result;
  }

  static async findByEmail(correo) {
    const [rows] = await pool.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return rows[0];
  }

  static async findByUsuario(usuario) {
    const [rows] = await pool.execute('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT id, nombre, correo, usuario, rol, fecha_registro FROM usuarios WHERE id = ?', [id]);
    return rows[0];
  }

  static async updateById(id, userData) {
    const { nombre, correo } = userData;
    const [result] = await pool.execute(
      'UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?',
      [nombre, correo, id]
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
    const [rows] = await pool.execute('SELECT id, nombre, correo, usuario, rol, fecha_registro FROM usuarios');
    return rows;
  }
}

module.exports = Usuario;
