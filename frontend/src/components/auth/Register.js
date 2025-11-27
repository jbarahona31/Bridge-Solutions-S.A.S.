import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    usuario: '',
    contraseña: '',
    confirmar_contraseña: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.contraseña !== formData.confirmar_contraseña) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const { confirmar_contraseña, ...registerData } = formData;
      await register(registerData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🌉</span>
          <h2>Crear Cuenta</h2>
          <p>Únete a Bridge Solutions S.A.S.</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="correo"
              className="form-control"
              value={formData.correo}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nombre de usuario</label>
            <input
              type="text"
              name="usuario"
              className="form-control"
              value={formData.usuario}
              onChange={handleChange}
              placeholder="juanperez"
              minLength="4"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="contraseña"
              className="form-control"
              value={formData.contraseña}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              minLength="6"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              name="confirmar_contraseña"
              className="form-control"
              value={formData.confirmar_contraseña}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              minLength="6"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="auth-footer">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
