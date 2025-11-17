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
    } else if (user?.role === 'recepcionista') {
      navigate('/recepcion');
    } else if (user?.role === 'medico') {
      navigate('/medico');
    }
  };

  return (
    <div className="dashboard-home">
      <h1>Bienvenido al Sistema</h1>
      <p>Usuario: {user?.id}</p>
      <p>Rol: {user?.role}</p>
      
      <div className="dashboard-actions">
        <button className="btn-navigate" onClick={handleNavigateToRole}>
          Ir a mi panel de {user?.role}
        </button>
      </div>
    </div>
  );
}

export default DashboardHome;
