import React, { useState, useEffect } from 'react';
import api from '../config/axiosConfig';
import { useAuth } from '../context/AuthContext';

function ReservationManagement() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    recurso: '',
    fechaInicio: '',
    fechaFin: '',
    proposito: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const fetchReservations = async () => {
    try {
      const params = filterEstado ? { estado: filterEstado } : {};
      const res = await api.get('/reservations', { params });
      setReservations(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener reservas:', err);
      setError('Error al cargar reservas');
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await api.get('/resources', { params: { estado: 'DISPONIBLE' } });
      setResources(res.data);
    } catch (err) {
      console.error('Error al obtener recursos:', err);
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchResources();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterEstado]);

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
      await api.post('/reservations', formData);
      setSuccess('Reserva creada exitosamente. Pendiente de aprobación.');
      setFormData({ recurso: '', fechaInicio: '', fechaFin: '', proposito: '' });
      setShowForm(false);
      fetchReservations();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear reserva');
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/reservations/${id}/status`, { estado: 'APROBADA' });
      setSuccess('Reserva aprobada exitosamente');
      fetchReservations();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al aprobar reserva');
    }
  };

  const handleReject = async (id) => {
    const motivoRechazo = prompt('Ingrese el motivo del rechazo:');
    if (!motivoRechazo) return;

    try {
      await api.patch(`/reservations/${id}/status`, { 
        estado: 'RECHAZADA', 
        motivoRechazo 
      });
      setSuccess('Reserva rechazada');
      fetchReservations();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al rechazar reserva');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta reserva?')) {
      try {
        await api.delete(`/reservations/${id}`);
        setSuccess('Reserva eliminada exitosamente');
        fetchReservations();
      } catch (err) {
        setError(err.response?.data?.message || 'Error al eliminar reserva');
      }
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'PENDIENTE': 'badge-warning',
      'APROBADA': 'badge-success',
      'RECHAZADA': 'badge-danger',
      'FINALIZADA': 'badge-secondary'
    };
    return badges[estado] || 'badge-secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div>Cargando reservas...</div>;

  const isDocente = user?.role === 'docente';
  const isGestor = user?.role === 'gestor' || user?.role === 'admin';

  return (
    <div className="reservation-management">
      <h2>{isDocente ? 'Mis Reservas' : 'Gestión de Reservas'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="actions-bar">
        {isDocente && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancelar' : 'Nueva Reserva'}
          </button>
        )}

        <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
          <option value="">Todas las reservas</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="APROBADA">Aprobadas</option>
          <option value="RECHAZADA">Rechazadas</option>
          <option value="FINALIZADA">Finalizadas</option>
        </select>
      </div>

      {showForm && isDocente && (
        <div className="reservation-form">
          <h3>Nueva Reserva</h3>
          <form onSubmit={handleSubmit}>
            <select
              name="recurso"
              value={formData.recurso}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione un recurso</option>
              {resources.map(resource => (
                <option key={resource._id} value={resource._id}>
                  {resource.nombre} ({resource.tipo})
                </option>
              ))}
            </select>

            <label>Fecha y hora de inicio:</label>
            <input
              type="datetime-local"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleInputChange}
              required
            />

            <label>Fecha y hora de fin:</label>
            <input
              type="datetime-local"
              name="fechaFin"
              value={formData.fechaFin}
              onChange={handleInputChange}
              required
            />

            <textarea
              name="proposito"
              placeholder="Propósito de uso"
              value={formData.proposito}
              onChange={handleInputChange}
              required
              rows="3"
            ></textarea>

            <div className="form-buttons">
              <button type="submit" className="btn-primary">Solicitar Reserva</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="reservation-list">
        <h3>Lista de Reservas ({reservations.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Recurso</th>
              {isGestor && <th>Solicitante</th>}
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Propósito</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(reservation => (
              <tr key={reservation._id}>
                <td>
                  {reservation.recurso?.nombre}
                  <br />
                  <small>{reservation.recurso?.tipo}</small>
                </td>
                {isGestor && (
                  <td>
                    {reservation.solicitante?.nombre}
                    <br />
                    <small>{reservation.solicitante?.email}</small>
                  </td>
                )}
                <td>{formatDate(reservation.fechaInicio)}</td>
                <td>{formatDate(reservation.fechaFin)}</td>
                <td>{reservation.proposito}</td>
                <td>
                  <span className={`badge ${getEstadoBadge(reservation.estado)}`}>
                    {reservation.estado}
                  </span>
                  {reservation.motivoRechazo && (
                    <div className="motivo-rechazo">
                      <small>{reservation.motivoRechazo}</small>
                    </div>
                  )}
                </td>
                <td>
                  {isGestor && reservation.estado === 'PENDIENTE' && (
                    <>
                      <button 
                        onClick={() => handleApprove(reservation._id)} 
                        className="btn-sm btn-success"
                      >
                        Aprobar
                      </button>
                      <button 
                        onClick={() => handleReject(reservation._id)} 
                        className="btn-sm btn-danger"
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                  {isDocente && reservation.estado === 'PENDIENTE' && (
                    <button 
                      onClick={() => handleDelete(reservation._id)} 
                      className="btn-sm btn-delete"
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReservationManagement;
