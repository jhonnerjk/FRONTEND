import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/DashboardLayout.css';

function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <div className="layout">
      <nav className="menu">
        <h3>Centro de Innovación UDI</h3>
        <p className="user-info">
          {user.nombre || user.email}
          <br />
          <span className="role-badge">{user.role}</span>
        </p>

        <Link to="/dashboard">📊 Inicio</Link>
        
        {user.role === 'admin' && (
          <Link to="/admin">👥 Gestionar Usuarios</Link>
        )}
        
        {(user.role === 'gestor' || user.role === 'admin') && (
          <Link to="/gestor">🎯 Gestión de Recursos</Link>
        )}
        
        {user.role === 'docente' && (
          <Link to="/docente">📅 Mis Reservas</Link>
        )}
        
        <button onClick={handleLogout} className="logout-btn">🚪 Cerrar Sesión</button>
      </nav>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;