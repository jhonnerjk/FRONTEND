import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import ReservationManagement from '../components/ReservationManagement.jsx';
import '../styles/DocentePage.css';

function DocentePage() {
  const { user } = useAuth();

  return (
    <div className="docente-page">
      <h1>Panel de Docente</h1>
      <p>Bienvenido, {user?.nombre || user?.email}</p>
      
      <div className="page-content">
        <ReservationManagement />
      </div>
    </div>
  );
}

export default DocentePage;
