import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import '../styles/DashboardHome.css';

function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNavigateToRole = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'gestor') {
      navigate('/gestor');
    } else if (user?.role === 'docente') {
      navigate('/docente');
    }
  };

  return (
    <div className="dashboard-home">
      <h1>Centro de Innovación y Laboratorios UDI</h1>
      <h2>Bienvenido al Sistema de Gestión de Recursos</h2>
      <p className="user-greeting">{user?.nombre || user?.email}</p>
      <p className="user-role">Rol{user?.roles?.length > 1 ? 'es' : ''}: <strong>{user?.roles?.map(r => r.toUpperCase()).join(', ') || user?.role?.toUpperCase()}</strong></p>
      
      <div className="dashboard-info">
        <div className="info-card">
          <h3>¿Qué puedes hacer?</h3>
          {user?.roles?.includes('admin') && (
            <ul>
              <li>Gestionar usuarios del sistema</li>
              <li>Asignar roles y permisos</li>
              <li>Activar/Desactivar cuentas</li>
            </ul>
          )}
          {user?.roles?.includes('gestor') && (
            <ul>
              <li>Registrar y gestionar recursos (salas y equipos)</li>
              <li>Aprobar o rechazar reservas</li>
              <li>Registrar incidencias</li>
            </ul>
          )}
          {user?.roles?.includes('docente') && (
            <ul>
              <li>Ver catálogo de recursos disponibles</li>
              <li>Crear solicitudes de reserva</li>
              <li>Ver estado de tus reservas</li>
            </ul>
          )}
        </div>
      </div>
      
      <div className="dashboard-actions">
        <button className="btn-navigate" onClick={handleNavigateToRole}>
          Ir a mi panel de trabajo
        </button>
      </div>
    </div>
  );
}

export default DashboardHome;
