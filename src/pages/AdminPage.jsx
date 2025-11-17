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
    nombre: '',
    email: '',
    password: '',
    role: 'docente',
    activo: true
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
      setFormData({ nombre: '', email: '', password: '', role: 'docente', activo: true });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear usuario');
    }
  };

  const handleToggleActivo = async (userId, currentActivo) => {
    try {
      await api.patch(`/users/${userId}`, { activo: !currentActivo });
      setSuccess(`Usuario ${!currentActivo ? 'activado' : 'desactivado'} exitosamente`);
      fetchUsers();
    } catch (err) {
      setError('Error al actualizar usuario');
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await api.patch(`/users/${userId}`, { role: newRole });
      setSuccess('Rol actualizado exitosamente');
      fetchUsers();
    } catch (err) {
      setError('Error al actualizar rol');
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="admin-page">
      <h1>Panel de Administrador</h1>
      <p>Bienvenido, {user?.nombre || user?.email}</p>
      
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
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
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
              <option value="gestor">Gestor</option>
              <option value="docente">Docente</option>
            </select>
            <label>
              <input
                type="checkbox"
                name="activo"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              />
              Usuario activo
            </label>
            <button type="submit" className="btn-submit">Crear Usuario</button>
          </form>
        </div>
      )}

      <div className="users-list">
        <h2>Lista de Usuarios ({users.length})</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className={!u.activo ? 'inactive-user' : ''}>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>
                  <select 
                    value={u.role} 
                    onChange={(e) => handleChangeRole(u._id, e.target.value)}
                    className="role-select"
                  >
                    <option value="admin">admin</option>
                    <option value="gestor">gestor</option>
                    <option value="docente">docente</option>
                  </select>
                </td>
                <td>
                  <span className={`badge badge-${u.activo ? 'success' : 'danger'}`}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => handleToggleActivo(u._id, u.activo)}
                    className={`btn-sm ${u.activo ? 'btn-danger' : 'btn-success'}`}
                  >
                    {u.activo ? 'Desactivar' : 'Activar'}
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

export default AdminPage;
