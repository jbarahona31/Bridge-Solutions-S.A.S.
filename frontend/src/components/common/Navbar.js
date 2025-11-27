import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🌉</span>
          <div className="brand-text">
            <span className="brand-name">Bridge Solutions</span>
            <span className="brand-subtitle">S.A.S.</span>
          </div>
        </Link>

        <div className="navbar-menu">
          {!user ? (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn btn-accent">
                Registrarse
              </Link>
            </>
          ) : (
            <>
              {isAdmin() ? (
                <>
                  <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
                    Panel Admin
                  </Link>
                  <Link to="/admin/cotizaciones" className={`nav-link ${isActive('/admin/cotizaciones') ? 'active' : ''}`}>
                    Cotizaciones
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                    Mi Panel
                  </Link>
                  <Link to="/cotizaciones" className={`nav-link ${isActive('/cotizaciones') ? 'active' : ''}`}>
                    Mis Cotizaciones
                  </Link>
                  <Link to="/cotizaciones/nueva" className={`nav-link ${isActive('/cotizaciones/nueva') ? 'active' : ''}`}>
                    Nueva Cotización
                  </Link>
                </>
              )}
              <Link to="/perfil" className={`nav-link ${isActive('/perfil') ? 'active' : ''}`}>
                Perfil
              </Link>
              <div className="navbar-user">
                <span className="user-name">{user.nombre}</span>
                <span className={`user-role badge ${isAdmin() ? 'badge-admin' : 'badge-user'}`}>
                  {user.rol}
                </span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
