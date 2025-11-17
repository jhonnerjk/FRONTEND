import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import PatientManagement from '../components/PatientManagement.jsx';
import AppointmentManagement from '../components/AppointmentManagement.jsx';
import '../styles/RecepcionistaPage.css';

function RecepcionistaPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('patients');

  return (
    <div className="recepcionista-page">
      <h1>📋 Panel de Recepcionista</h1>
      <p>Bienvenido, {user?.id}</p>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveTab('patients')}
        >
          Gestión de Pacientes
        </button>
        <button 
          className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Gestión de Turnos
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'patients' ? <PatientManagement /> : <AppointmentManagement />}
      </div>
    </div>
  );
}

export default RecepcionistaPage;
