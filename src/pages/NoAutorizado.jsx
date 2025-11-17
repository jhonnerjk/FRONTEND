import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NoAutorizado.css';

function NoAutorizado() {
  const navigate = useNavigate();

  return (
    <div className="no-autorizado-container">
      <h1>⛔ Acceso No Autorizado</h1>
      <p>No tienes permisos para acceder a esta página.</p>
      <button className="btn-back" onClick={() => navigate('/dashboard')}>
        Volver al Dashboard
      </button>
    </div>
  );
}

export default NoAutorizado;
