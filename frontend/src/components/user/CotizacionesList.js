import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cotizacionService } from '../../services';
import './User.css';

const CotizacionesList = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCotizaciones();
  }, []);

  const fetchCotizaciones = async () => {
    try {
      const response = await cotizacionService.getMyCotizaciones();
      setCotizaciones(response.cotizaciones);
    } catch (err) {
      setError('Error al cargar cotizaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta cotización?')) {
      try {
        await cotizacionService.delete(id);
        fetchCotizaciones();
      } catch (err) {
        setError(err.response?.data?.message || 'Error al eliminar cotización');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
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
    <div className="cotizaciones-list">
      <div className="container">
        <div className="page-header">
          <h1>Mis Cotizaciones</h1>
          <Link to="/cotizaciones/nueva" className="btn btn-primary">
            + Nueva Cotización
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {cotizaciones.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <h3>No tienes cotizaciones</h3>
              <p>Crea tu primera cotización para comenzar</p>
              <Link to="/cotizaciones/nueva" className="btn btn-accent">
                Crear Cotización
              </Link>
            </div>
          </div>
        ) : (
          cotizaciones.map((cotizacion) => {
            const badge = getEstadoBadge(cotizacion.estado);
            return (
              <div key={cotizacion.id} className="cotizacion-card">
                <div className="cotizacion-card-header">
                  <div>
                    <h3 className="cotizacion-title">{cotizacion.servicio}</h3>
                    <span className="cotizacion-id">#{cotizacion.id}</span>
                  </div>
                  <span className={`badge ${badge.class}`}>{badge.text}</span>
                </div>
                
                <p className="cotizacion-description">{cotizacion.descripcion}</p>
                
                <div className="cotizacion-meta">
                  <span>📅 Creada: {formatDate(cotizacion.fecha_creacion)}</span>
                  {cotizacion.documentos && cotizacion.documentos.length > 0 && (
                    <span>📎 {cotizacion.documentos.length} documento(s)</span>
                  )}
                </div>

                {cotizacion.observacion_admin && (
                  <div className="observacion-box">
                    <h4>Observación del Administrador:</h4>
                    <p>{cotizacion.observacion_admin}</p>
                  </div>
                )}

                <div className="cotizacion-actions">
                  <Link to={`/cotizaciones/${cotizacion.id}`} className="btn btn-outline">
                    Ver Detalles
                  </Link>
                  {cotizacion.estado === 'pendiente' && (
                    <>
                      <Link to={`/cotizaciones/${cotizacion.id}/editar`} className="btn btn-accent">
                        Editar
                      </Link>
                      <button 
                        onClick={() => handleDelete(cotizacion.id)} 
                        className="btn btn-danger"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CotizacionesList;
