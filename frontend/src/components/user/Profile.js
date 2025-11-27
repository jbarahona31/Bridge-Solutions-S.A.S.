import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services';
import './User.css';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    correo: ''
  });
  const [passwordData, setPasswordData] = useState({
    contraseña_actual: '',
    contraseña_nueva: '',
    confirmar_contraseña: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        correo: user.correo || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.updateProfile(formData);
      updateUserProfile(response.user);
      setSuccess('Perfil actualizado exitosamente');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.contraseña_nueva !== passwordData.confirmar_contraseña) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    try {
      await authService.changePassword({
        contraseña_actual: passwordData.contraseña_actual,
        contraseña_nueva: passwordData.contraseña_nueva
      });
      setPasswordSuccess('Contraseña actualizada exitosamente');
      setPasswordData({
        contraseña_actual: '',
        contraseña_nueva: '',
        confirmar_contraseña: ''
      });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {getInitials(user?.nombre)}
            </div>
            <h2>{user?.nombre}</h2>
            <p>@{user?.usuario}</p>
            <span className={`badge ${user?.rol === 'administrador' ? 'badge-admin' : 'badge-user'}`}>
              {user?.rol}
            </span>
          </div>

          <div className="profile-section">
            <h3 className="profile-section-title">Información Personal</h3>
            
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre completo</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={formData.nombre}
                  onChange={handleChange}
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
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </form>
          </div>

          <div className="profile-section">
            <h3 className="profile-section-title">Cambiar Contraseña</h3>
            
            {passwordError && <div className="alert alert-danger">{passwordError}</div>}
            {passwordSuccess && <div className="alert alert-success">{passwordSuccess}</div>}

            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label">Contraseña actual</label>
                <input
                  type="password"
                  name="contraseña_actual"
                  className="form-control"
                  value={passwordData.contraseña_actual}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nueva contraseña</label>
                <input
                  type="password"
                  name="contraseña_nueva"
                  className="form-control"
                  value={passwordData.contraseña_nueva}
                  onChange={handlePasswordChange}
                  minLength="6"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  name="confirmar_contraseña"
                  className="form-control"
                  value={passwordData.confirmar_contraseña}
                  onChange={handlePasswordChange}
                  minLength="6"
                  required
                />
              </div>

              <button type="submit" className="btn btn-accent" disabled={loading}>
                {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
