import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../config/axiosConfig';
import '../styles/AdminPage.css';

function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'recepcionista'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      setError('Error al cargar usuarios');
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
      await api.post('/users', formData);
      setSuccess('Usuario creado exitosamente');
      setFormData({ email: '', password: '', role: 'recepcionista' });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear usuario');
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="admin-page">
      <h1>👨‍💼 Panel de Administrador</h1>
      <p>Bienvenido, {user?.id}</p>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="admin-actions">
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Crear Nuevo Usuario'}
        </button>
      </div>

      {showForm && (
        <div className="user-form">
          <h3>Crear Usuario</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength="6"
            />
            <select name="role" value={formData.role} onChange={handleInputChange}>
              <option value="admin">Administrador</option>
              <option value="recepcionista">Recepcionista</option>
              <option value="medico">Médico</option>
            </select>
            <button type="submit" className="btn-submit">Crear Usuario</button>
          </form>
        </div>
      )}

      <div className="users-list">
        <h2>Lista de Usuarios</h2>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.email}</td>
                <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;
