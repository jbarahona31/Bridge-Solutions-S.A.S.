import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cotizacionService } from '../../services';
import './User.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    aprobadas: 0,
    rechazadas: 0
  });

  useEffect(() => {
    fetchCotizaciones();
  }, []);

  const fetchCotizaciones = async () => {
    try {
      const response = await cotizacionService.getMyCotizaciones();
      setCotizaciones(response.cotizaciones);
      
      // Calculate stats
      const total = response.cotizaciones.length;
      const pendientes = response.cotizaciones.filter(c => c.estado === 'pendiente' || c.estado === 'en_revision').length;
      const aprobadas = response.cotizaciones.filter(c => c.estado === 'aprobada').length;
      const rechazadas = response.cotizaciones.filter(c => c.estado === 'rechazada').length;
      
      setStats({ total, pendientes, aprobadas, rechazadas });
    } catch (error) {
      console.error('Error fetching cotizaciones:', error);
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
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Bienvenido, {user?.nombre}</h1>
          <p>Panel de control de tu cuenta</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Cotizaciones</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#ffc107' }}>{stats.pendientes}</div>
            <div className="stat-label">En Proceso</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#28a745' }}>{stats.aprobadas}</div>
            <div className="stat-label">Aprobadas</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#dc3545' }}>{stats.rechazadas}</div>
            <div className="stat-label">Rechazadas</div>
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/cotizaciones/nueva" className="btn btn-primary">
            + Nueva Cotización
          </Link>
          <Link to="/cotizaciones" className="btn btn-outline">
            Ver Todas las Cotizaciones
          </Link>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Últimas Cotizaciones</h3>
          </div>
          
          {cotizaciones.length === 0 ? (
            <div className="empty-state">
              <p>No tienes cotizaciones aún.</p>
              <Link to="/cotizaciones/nueva" className="btn btn-accent">
                Crear tu primera cotización
              </Link>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Servicio</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cotizaciones.slice(0, 5).map((cotizacion) => {
                  const badge = getEstadoBadge(cotizacion.estado);
                  return (
                    <tr key={cotizacion.id}>
                      <td>#{cotizacion.id}</td>
                      <td>{cotizacion.servicio}</td>
                      <td>
                        <span className={`badge ${badge.class}`}>
                          {badge.text}
                        </span>
                      </td>
                      <td>{formatDate(cotizacion.fecha_creacion)}</td>
                      <td>
                        <Link to={`/cotizaciones/${cotizacion.id}`} className="btn btn-sm btn-outline">
                          Ver Detalles
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
