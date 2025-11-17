import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../config/axiosConfig';
import '../styles/MedicoPage.css';

function MedicoPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = async () => {
    try {
      const res = await api.get('/appointments/my-appointments');
      setAppointments(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener turnos:', err);
      setError('Error al cargar turnos');
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/appointments/${id}`, { estado: newStatus });
      setSuccess(`Turno marcado como ${newStatus}`);
      fetchMyAppointments();
    } catch (err) {
      setError('Error al actualizar turno');
    }
  };

  if (loading) return <div>Cargando turnos...</div>;

  return (
    <div className="medico-page">
      <h1>👨‍⚕️ Panel de Médico</h1>
      <p>Bienvenido, Dr. {user?.id}</p>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="appointments-section">
        <h2>Mis Turnos</h2>
        
        {appointments.length === 0 ? (
          <p>No tienes turnos asignados.</p>
        ) : (
          <div className="appointments-grid">
            {appointments.map(appointment => (
              <div key={appointment._id} className="appointment-card">
                <div className="card-header">
                  <span className={`status-badge badge-${appointment.estado.toLowerCase()}`}>
                    {appointment.estado}
                  </span>
                </div>
                <div className="card-body">
                  <h3>{appointment.patient?.nombreCompleto}</h3>
                  <p><strong>CI:</strong> {appointment.patient?.ci}</p>
                  <p><strong>Teléfono:</strong> {appointment.patient?.telefono || 'N/A'}</p>
                  <p><strong>Fecha:</strong> {new Date(appointment.fecha).toLocaleDateString()}</p>
                  <p><strong>Hora:</strong> {appointment.hora}</p>
                  <p><strong>Motivo:</strong> {appointment.motivo || 'No especificado'}</p>
                </div>
                
                {appointment.estado === 'PROGRAMADO' && (
                  <div className="card-actions">
                    <button 
                      className="btn-success"
                      onClick={() => handleUpdateStatus(appointment._id, 'ATENDIDO')}
                    >
                      Marcar Atendido
                    </button>
                    <button 
                      className="btn-warning"
                      onClick={() => handleUpdateStatus(appointment._id, 'AUSENTE')}
                    >
                      Marcar Ausente
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicoPage;
