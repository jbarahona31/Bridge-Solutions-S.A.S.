import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cotizacionService, usuarioService } from '../../services';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    en_revision: 0,
    aprobadas: 0,
    rechazadas: 0
  });
  const [recentCotizaciones, setRecentCotizaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, cotizacionesRes, usuariosRes] = await Promise.all([
        cotizacionService.getStats(),
        cotizacionService.getAll(),
        usuarioService.getAll()
      ]);
      
      setStats(statsRes.stats);
      setRecentCotizaciones(cotizacionesRes.cotizaciones.slice(0, 5));
      setUsuarios(usuariosRes.usuarios);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: { class: 'badge-pendiente', text: 'Pendiente' },
      en_revision: { class: 'badge-en_revision', text: 'En Revisión' },
      aprobada: { class: 'badge-aprobada', text: 'Aprobada' },
      rechazada: { class: 'badge-rechazada', text: 'Rechazada' }
    };
    return badges[estado] || badges.pendiente;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Panel de Administración</h1>
          <p>Gestiona cotizaciones, usuarios y documentos</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Cotizaciones</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#ffc107' }}>{stats.pendientes}</div>
            <div className="stat-label">Pendientes</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#17a2b8' }}>{stats.en_revision}</div>
            <div className="stat-label">En Revisión</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#28a745' }}>{stats.aprobadas}</div>
            <div className="stat-label">Aprobadas</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#dc3545' }}>{stats.rechazadas}</div>
            <div className="stat-label">Rechazadas</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{usuarios.length}</div>
            <div className="stat-label">Usuarios Registrados</div>
          </div>
        </div>

        <div className="admin-grid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Cotizaciones Recientes</h3>
              <Link to="/admin/cotizaciones" className="btn btn-outline btn-sm">
                Ver Todas
              </Link>
            </div>
            
            {recentCotizaciones.length === 0 ? (
              <p className="text-muted">No hay cotizaciones</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Servicio</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCotizaciones.map((cot) => {
                    const badge = getEstadoBadge(cot.estado);
                    return (
                      <tr key={cot.id}>
                        <td>#{cot.id}</td>
                        <td>{cot.nombre}</td>
                        <td>{cot.servicio}</td>
                        <td>
                          <span className={`badge ${badge.class}`}>{badge.text}</span>
                        </td>
                        <td>{formatDate(cot.fecha_creacion)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Usuarios Recientes</h3>
            </div>
            
            {usuarios.length === 0 ? (
              <p className="text-muted">No hay usuarios registrados</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.slice(0, 5).map((user) => (
                    <tr key={user.id}>
                      <td>{user.nombre}</td>
                      <td>{user.correo}</td>
                      <td>
                        <span className={`badge ${user.rol === 'administrador' ? 'badge-admin' : 'badge-user'}`}>
                          {user.rol}
                        </span>
                      </td>
                      <td>{formatDate(user.fecha_registro)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
