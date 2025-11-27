import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { cotizacionService } from '../../services';
import './Admin.css';

const AdminCotizaciones = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    estado: '',
    fecha_desde: '',
    fecha_hasta: ''
  });

  const fetchCotizaciones = useCallback(async () => {
    try {
      setLoading(true);
      const activeFilters = {};
      Object.keys(filters).forEach(key => {
        if (filters[key]) activeFilters[key] = filters[key];
      });
      
      const response = await cotizacionService.getAll(activeFilters);
      setCotizaciones(response.cotizaciones);
    } catch (error) {
      console.error('Error fetching cotizaciones:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCotizaciones();
  }, [fetchCotizaciones]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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

  const exportToCSV = () => {
    const headers = ['ID', 'Usuario', 'Correo', 'Servicio', 'Estado', 'Fecha'];
    const rows = cotizaciones.map(cot => [
      cot.id,
      cot.nombre,
      cot.correo,
      cot.servicio,
      cot.estado,
      formatDate(cot.fecha_creacion)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `cotizaciones_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="admin-cotizaciones">
      <div className="container">
        <div className="page-header">
          <h1>Gestión de Cotizaciones</h1>
        </div>

        <div className="filters-bar">
          <div className="filter-group">
            <label>Estado</label>
            <select name="estado" value={filters.estado} onChange={handleFilterChange}>
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_revision">En Revisión</option>
              <option value="aprobada">Aprobada</option>
              <option value="rechazada">Rechazada</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Desde</label>
            <input
              type="date"
              name="fecha_desde"
              value={filters.fecha_desde}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label>Hasta</label>
            <input
              type="date"
              name="fecha_hasta"
              value={filters.fecha_hasta}
              onChange={handleFilterChange}
            />
          </div>

          <div className="export-buttons">
            <button onClick={exportToCSV} className="btn btn-outline">
              📊 Exportar CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="card">
            {cotizaciones.length === 0 ? (
              <p className="text-muted">No hay cotizaciones que coincidan con los filtros</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Correo</th>
                    <th>Servicio</th>
                    <th>Estado</th>
                    <th>Docs</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cotizaciones.map((cot) => {
                    const badge = getEstadoBadge(cot.estado);
                    return (
                      <tr key={cot.id}>
                        <td>#{cot.id}</td>
                        <td>{cot.nombre}</td>
                        <td>{cot.correo}</td>
                        <td>{cot.servicio}</td>
                        <td>
                          <span className={`badge ${badge.class}`}>{badge.text}</span>
                        </td>
                        <td>{cot.documentos?.length || 0}</td>
                        <td>{formatDate(cot.fecha_creacion)}</td>
                        <td>
                          <Link to={`/admin/cotizaciones/${cot.id}`} className="btn btn-sm btn-primary">
                            Revisar
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCotizaciones;
