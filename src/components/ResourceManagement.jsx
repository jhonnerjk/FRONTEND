import React, { useState, useEffect } from 'react';
import api from '../config/axiosConfig';

function ResourceManagement() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'SALA',
    capacidad: '',
    estado: 'DISPONIBLE',
    descripcion: '',
    ubicacion: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterTipo, setFilterTipo] = useState('');

  const fetchResources = async () => {
    try {
      const params = filterTipo ? { tipo: filterTipo } : {};
      const res = await api.get('/resources', { params });
      setResources(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener recursos:', err);
      setError('Error al cargar recursos');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTipo]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await api.put(`/resources/${editingId}`, formData);
        setSuccess('Recurso actualizado exitosamente');
      } else {
        await api.post('/resources', formData);
        setSuccess('Recurso registrado exitosamente');
      }
      
      resetForm();
      fetchResources();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar recurso');
    }
  };

  const handleEdit = (resource) => {
    setFormData({
      nombre: resource.nombre,
      tipo: resource.tipo,
      capacidad: resource.capacidad || '',
      estado: resource.estado,
      descripcion: resource.descripcion || '',
      ubicacion: resource.ubicacion || ''
    });
    setEditingId(resource._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este recurso?')) {
      try {
        await api.delete(`/resources/${id}`);
        setSuccess('Recurso eliminado exitosamente');
        fetchResources();
      } catch (err) {
        setError(err.response?.data?.message || 'Error al eliminar recurso');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      tipo: 'SALA',
      capacidad: '',
      estado: 'DISPONIBLE',
      descripcion: '',
      ubicacion: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div>Cargando recursos...</div>;

  return (
    <div className="resource-management">
      <h2>Gestión de Recursos</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="actions-bar">
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : editingId ? 'Editar Recurso' : 'Registrar Nuevo Recurso'}
        </button>

        <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
          <option value="">Todos los recursos</option>
          <option value="SALA">Salas</option>
          <option value="EQUIPO">Equipos</option>
        </select>
      </div>

      {showForm && (
        <div className="resource-form">
          <h3>{editingId ? 'Editar Recurso' : 'Registrar Recurso'}</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del recurso"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
            
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              required
            >
              <option value="SALA">Sala</option>
              <option value="EQUIPO">Equipo</option>
            </select>

            {formData.tipo === 'SALA' && (
              <input
                type="number"
                name="capacidad"
                placeholder="Capacidad"
                value={formData.capacidad}
                onChange={handleInputChange}
                min="1"
              />
            )}

            <select
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              required
            >
              <option value="DISPONIBLE">Disponible</option>
              <option value="FUERA_DE_SERVICIO">Fuera de Servicio</option>
            </select>

            <input
              type="text"
              name="ubicacion"
              placeholder="Ubicación"
              value={formData.ubicacion}
              onChange={handleInputChange}
            />

            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows="3"
            ></textarea>

            <div className="form-buttons">
              <button type="submit" className="btn-primary">
                {editingId ? 'Actualizar' : 'Registrar'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="resource-list">
        <h3>Lista de Recursos ({resources.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Capacidad</th>
              <th>Estado</th>
              <th>Ubicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resources.map(resource => (
              <tr key={resource._id}>
                <td>{resource.nombre}</td>
                <td>{resource.tipo}</td>
                <td>{resource.capacidad || 'N/A'}</td>
                <td>
                  <span className={`badge badge-${resource.estado === 'DISPONIBLE' ? 'success' : 'danger'}`}>
                    {resource.estado}
                  </span>
                </td>
                <td>{resource.ubicacion || 'N/A'}</td>
                <td>
                  <button onClick={() => handleEdit(resource)} className="btn-sm btn-edit">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(resource._id)} className="btn-sm btn-delete">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResourceManagement;
