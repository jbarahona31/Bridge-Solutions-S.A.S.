import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { cotizacionService } from '../../services';
import './User.css';

const CotizacionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    servicio: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const servicios = [
    'Avalúo Comercial',
    'Avalúo Industrial',
    'Avalúo Rural',
    'Avalúo Urbano',
    'Valoración Financiera',
    'Consultoría Empresarial',
    'Importaciones',
    'Otro'
  ];

  const fetchCotizacion = useCallback(async () => {
    try {
      const response = await cotizacionService.getById(id);
      setFormData({
        servicio: response.cotizacion.servicio,
        descripcion: response.cotizacion.descripcion
      });
    } catch (err) {
      setError('Error al cargar cotización');
    } finally {
      setFetching(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEdit) {
      fetchCotizacion();
    }
  }, [isEdit, fetchCotizacion]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isEdit) {
        await cotizacionService.update(id, formData);
        setSuccess('Cotización actualizada exitosamente');
      } else {
        await cotizacionService.create(formData);
        setSuccess('Cotización creada exitosamente');
      }
      
      setTimeout(() => {
        navigate('/cotizaciones');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar cotización');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="cotizacion-form">
      <div className="container">
        <div className="form-card">
          <h2 className="form-title">
            {isEdit ? 'Editar Cotización' : 'Nueva Cotización'}
          </h2>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Tipo de Servicio *</label>
              <select
                name="servicio"
                className="form-control"
                value={formData.servicio}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un servicio</option>
                {servicios.map((servicio) => (
                  <option key={servicio} value={servicio}>
                    {servicio}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Descripción del requerimiento *</label>
              <textarea
                name="descripcion"
                className="form-control"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe detalladamente lo que necesitas. Incluye información sobre el bien a avaluar, ubicación, propósito del avalúo, fechas importantes, etc."
                rows="6"
                required
              ></textarea>
            </div>

            <div className="form-actions">
              <Link to="/cotizaciones" className="btn btn-outline">
                Cancelar
              </Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading 
                  ? (isEdit ? 'Actualizando...' : 'Creando...') 
                  : (isEdit ? 'Actualizar Cotización' : 'Crear Cotización')
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CotizacionForm;
