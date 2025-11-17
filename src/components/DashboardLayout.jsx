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
        <h3>Centro Médico</h3>
        <p>Rol: {user.role}</p>

        <Link to="/dashboard">Inicio (Todos)</Link>
        
        {user.role === 'admin' && (
          <Link to="/admin">Gestionar Usuarios (Admin)</Link>
        )}
        
        {user.role === 'recepcionista' && (
          <Link to="/recepcion">Gestionar Turnos (Recep.)</Link>
        )}
        
        {user.role === 'medico' && (
          <Link to="/medico">Mis Turnos (Médico)</Link>
        )}
        
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </nav>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;