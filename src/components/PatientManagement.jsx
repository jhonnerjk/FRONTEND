import React, { useState, useEffect } from 'react';
import api from '../config/axiosConfig';

function PatientManagement() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    ci: '',
    fechaNacimiento: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients');
      setPatients(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener pacientes:', err);
      setError('Error al cargar pacientes');
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
      await api.post('/patients', formData);
      setSuccess('Paciente registrado exitosamente');
      setFormData({ nombreCompleto: '', ci: '', fechaNacimiento: '', telefono: '' });
      setShowForm(false);
      fetchPatients();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar paciente');
    }
  };

  if (loading) return <div>Cargando pacientes...</div>;

  return (
    <div className="patient-management">
      <h2>Gestión de Pacientes</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancelar' : 'Registrar Nuevo Paciente'}
      </button>

      {showForm && (
        <div className="patient-form">
          <h3>Registrar Paciente</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="nombreCompleto"
              placeholder="Nombre Completo"
              value={formData.nombreCompleto}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="ci"
              placeholder="CI"
              value={formData.ci}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              name="fechaNacimiento"
              placeholder="Fecha de Nacimiento"
              value={formData.fechaNacimiento}
              onChange={handleInputChange}
              required
            />
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleInputChange}
            />
            <button type="submit" className="btn-submit">Registrar Paciente</button>
          </form>
        </div>
      )}

      <div className="patients-list">
        <h3>Lista de Pacientes</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>CI</th>
              <th>Fecha Nacimiento</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p._id}>
                <td>{p.nombreCompleto}</td>
                <td>{p.ci}</td>
                <td>{p.fechaNacimiento ? new Date(p.fechaNacimiento).toLocaleDateString() : 'N/A'}</td>
                <td>{p.telefono || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientManagement;
