import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import ResourceManagement from '../components/ResourceManagement.jsx';
import ReservationManagement from '../components/ReservationManagement.jsx';
import '../styles/GestorPage.css';

function GestorPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('resources');

  return (
    <div className="gestor-page">
      <h1>Panel de Gestor de Recursos</h1>
      <p>Bienvenido, {user?.nombre || user?.email}</p>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          Gestión de Recursos
        </button>
        <button 
          className={`tab ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          Gestión de Reservas
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'resources' ? <ResourceManagement /> : <ReservationManagement />}
      </div>
    </div>
  );
}

export default GestorPage;
