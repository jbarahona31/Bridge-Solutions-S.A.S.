import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cotizacionService } from '../../services';
import './Admin.css';

const AdminCotizacionDetail = () => {
  const { id } = useParams();
  const [cotizacion, setCotizacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    estado: '',
    observacion_admin: ''
  });

  const fetchCotizacion = useCallback(async () => {
    try {
      const response = await cotizacionService.getById(id);
      setCotizacion(response.cotizacion);
      setFormData({
        estado: response.cotizacion.estado,
        observacion_admin: response.cotizacion.observacion_admin || ''
      });
    } catch (err) {
      setError('Error al cargar cotización');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCotizacion();
  }, [fetchCotizacion]);

  const handleEstadoChange = (estado) => {
    setFormData({ ...formData, estado });
  };

  const handleObservacionChange = (e) => {
    setFormData({ ...formData, observacion_admin: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await cotizacionService.updateEstado(id, formData);
      setSuccess('Cotización actualizada exitosamente');
      fetchCotizacion();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar cotización');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDocumentIcon = (tipo) => {
    if (tipo?.includes('pdf')) return '📄';
    if (tipo?.includes('image')) return '🖼️';
    if (tipo?.includes('word') || tipo?.includes('document')) return '📝';
    if (tipo?.includes('excel') || tipo?.includes('sheet')) return '📊';
    return '📎';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!cotizacion) {
    return (
      <div className="container">
        <div className="alert alert-danger">Cotización no encontrada</div>
        <Link to="/admin/cotizaciones" className="btn btn-primary">Volver</Link>
      </div>
    );
  }

  return (
    <div className="admin-cotizacion-detail">
      <div className="container">
        <div className="page-header">
          <h1>Cotización #{cotizacion.id}</h1>
          <Link to="/admin/cotizaciones" className="btn btn-outline">
            ← Volver
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="admin-cotizacion-card">
          <div className="admin-cotizacion-header">
            <div>
              <h2>{cotizacion.servicio}</h2>
              <span>Creada: {formatDate(cotizacion.fecha_creacion)}</span>
            </div>
          </div>

          <div className="user-info-box">
            <h4>Información del Usuario</h4>
            <p><strong>Nombre:</strong> {cotizacion.nombre}</p>
            <p><strong>Correo:</strong> {cotizacion.correo}</p>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción del Requerimiento</label>
            <div style={{ 
              padding: 'var(--spacing-md)', 
              backgroundColor: 'var(--color-gray-light)',
              borderRadius: 'var(--radius-md)',
              whiteSpace: 'pre-wrap'
            }}>
              {cotizacion.descripcion}
            </div>
          </div>

          {cotizacion.documentos && cotizacion.documentos.length > 0 && (
            <div className="documents-section">
              <h3>Documentos Adjuntos ({cotizacion.documentos.length})</h3>
              <div className="document-list">
                {cotizacion.documentos.map((doc) => (
                  <div key={doc.id} className="document-item">
                    <span className="document-icon">{getDocumentIcon(doc.tipo)}</span>
                    <div className="document-info">
                      <div className="document-name">
                        {doc.archivo_url.split('/').pop()}
                      </div>
                      <div className="document-type">{doc.tipo}</div>
                    </div>
                    <a 
                      href={`http://localhost:3000${doc.archivo_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline"
                    >
                      Ver
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="admin-actions">
            <form onSubmit={handleSubmit}>
              <h3>Actualizar Estado</h3>
              
              <div className="estado-selector">
                <button
                  type="button"
                  className={`estado-btn pendiente ${formData.estado === 'pendiente' ? 'active' : ''}`}
                  onClick={() => handleEstadoChange('pendiente')}
                >
                  Pendiente
                </button>
                <button
                  type="button"
                  className={`estado-btn en_revision ${formData.estado === 'en_revision' ? 'active' : ''}`}
                  onClick={() => handleEstadoChange('en_revision')}
                >
                  En Revisión
                </button>
                <button
                  type="button"
                  className={`estado-btn aprobada ${formData.estado === 'aprobada' ? 'active' : ''}`}
                  onClick={() => handleEstadoChange('aprobada')}
                >
                  Aprobar
                </button>
                <button
                  type="button"
                  className={`estado-btn rechazada ${formData.estado === 'rechazada' ? 'active' : ''}`}
                  onClick={() => handleEstadoChange('rechazada')}
                >
                  Rechazar
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Observación para el usuario</label>
                <textarea
                  className="form-control"
                  value={formData.observacion_admin}
                  onChange={handleObservacionChange}
                  placeholder="Escribe una observación o comentario para el usuario..."
                  rows="4"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCotizacionDetail;
