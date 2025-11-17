import React, { useState, useEffect } from 'react';
import api from '../config/axiosConfig';

function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patient: '',
    medico: '',
    fecha: '',
    hora: '',
    motivo: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/patients'),
        api.get('/users/doctors')
      ]);
      
      console.log('Pacientes obtenidos:', patientsRes.data);
      console.log('Médicos obtenidos:', doctorsRes.data);
      
      setAppointments(appointmentsRes.data);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener datos:', err);
      setError('Error al cargar datos');
      setLoading(false);
    }
  };

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
      await api.post('/appointments', formData);
      setSuccess('Turno creado exitosamente');
      setFormData({ patient: '', medico: '', fecha: '', hora: '', motivo: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear turno');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('¿Está seguro de cancelar este turno?')) return;

    try {
      await api.put(`/appointments/${id}/cancel`);
      setSuccess('Turno cancelado');
      fetchData();
    } catch (err) {
      setError('Error al cancelar turno');
    }
  };

  if (loading) return <div>Cargando turnos...</div>;

  return (
    <div className="appointment-management">
      <h2>Gestión de Turnos</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancelar' : 'Crear Nuevo Turno'}
      </button>

      {showForm && (
        <div className="appointment-form">
          <h3>Crear Turno</h3>
          <form onSubmit={handleSubmit}>
            <select name="patient" value={formData.patient} onChange={handleInputChange} required>
              <option value="">Seleccionar Paciente</option>
              {patients.map(p => (
                <option key={p._id} value={p._id}>{p.nombreCompleto} - {p.ci}</option>
              ))}
            </select>

            <select name="medico" value={formData.medico} onChange={handleInputChange} required>
              <option value="">Seleccionar Médico</option>
              {doctors.map(d => (
                <option key={d._id} value={d._id}>{d.email}</option>
              ))}
            </select>

            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
            />

            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleInputChange}
              required
            />

            <textarea
              name="motivo"
              placeholder="Motivo de la consulta"
              value={formData.motivo}
              onChange={handleInputChange}
              rows="3"
            />

            <button type="submit" className="btn-submit">Crear Turno</button>
          </form>
        </div>
      )}

      <div className="appointments-list">
        <h3>Lista de Turnos</h3>
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a._id}>
                <td>{a.patient?.nombreCompleto || 'N/A'}</td>
                <td>{a.medico?.email || 'N/A'}</td>
                <td>{new Date(a.fecha).toLocaleDateString()}</td>
                <td>{a.hora}</td>
                <td><span className={`badge badge-${a.estado.toLowerCase()}`}>{a.estado}</span></td>
                <td>
                  {a.estado === 'PROGRAMADO' && (
                    <button className="btn-cancel" onClick={() => handleCancel(a._id)}>Cancelar</button>
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

export default AppointmentManagement;
