import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cotizacionService, documentoService } from '../../services';
import './User.css';

const CotizacionDetail = () => {
  const { id } = useParams();
  const [cotizacion, setCotizacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchCotizacion = useCallback(async () => {
    try {
      const response = await cotizacionService.getById(id);
      setCotizacion(response.cotizacion);
    } catch (err) {
      setError('Error al cargar cotización');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCotizacion();
  }, [fetchCotizacion]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('cotizacion_id', id);
    formData.append('tipo', file.type);

    try {
      await documentoService.upload(formData);
      fetchCotizacion();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al subir documento');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (window.confirm('¿Estás seguro de eliminar este documento?')) {
      try {
        await documentoService.delete(docId);
        fetchCotizacion();
      } catch (err) {
        setError('Error al eliminar documento');
      }
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

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: { class: 'badge-pendiente', text: 'Pendiente' },
      en_revision: { class: 'badge-en_revision', text: 'En Revisión' },
      aprobada: { class: 'badge-aprobada', text: 'Aprobada' },
      rechazada: { class: 'badge-rechazada', text: 'Rechazada' }
    };
    return badges[estado] || badges.pendiente;
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
        <Link to="/cotizaciones" className="btn btn-primary">Volver</Link>
      </div>
    );
  }

  const badge = getEstadoBadge(cotizacion.estado);

  return (
    <div className="cotizacion-form">
      <div className="container">
        <div className="page-header">
          <h1>Detalle de Cotización #{cotizacion.id}</h1>
          <Link to="/cotizaciones" className="btn btn-outline">
            ← Volver
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-card">
          <div className="cotizacion-card-header">
            <div>
              <h2 className="cotizacion-title">{cotizacion.servicio}</h2>
            </div>
            <span className={`badge ${badge.class}`}>{badge.text}</span>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <p style={{ whiteSpace: 'pre-wrap' }}>{cotizacion.descripcion}</p>
          </div>

          <div className="cotizacion-meta">
            <span>📅 Creada: {formatDate(cotizacion.fecha_creacion)}</span>
            <span>🔄 Actualizada: {formatDate(cotizacion.fecha_actualizacion)}</span>
          </div>

          {cotizacion.observacion_admin && (
            <div className="observacion-box">
              <h4>Observación del Administrador:</h4>
              <p>{cotizacion.observacion_admin}</p>
            </div>
          )}

          {cotizacion.estado === 'pendiente' && (
            <div className="form-actions">
              <Link to={`/cotizaciones/${cotizacion.id}/editar`} className="btn btn-accent">
                Editar Cotización
              </Link>
            </div>
          )}

          <div className="documents-section">
            <h3>Documentos Adjuntos</h3>
            
            {cotizacion.documentos && cotizacion.documentos.length > 0 ? (
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
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="btn btn-danger btn-sm"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No hay documentos adjuntos</p>
            )}

            {cotizacion.estado === 'pendiente' && (
              <div className="upload-zone" style={{ marginTop: 'var(--spacing-lg)' }}>
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                  {uploading ? (
                    <span>Subiendo...</span>
                  ) : (
                    <>
                      <span style={{ fontSize: '2rem' }}>📎</span>
                      <p>Arrastra un archivo o haz clic para subir</p>
                      <small>PDF, Word, Excel, Imágenes (máx. 10MB)</small>
                    </>
                  )}
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CotizacionDetail;
