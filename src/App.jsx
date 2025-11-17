import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

// Páginas comunes
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import NoAutorizado from './pages/NoAutorizado';
import DashboardHome from './pages/DashboardHome';

// Lazy Loading para optimización
const AdminPage = lazy(() => import('./pages/AdminPage'));
const RecepcionistaPage = lazy(() => import('./pages/RecepcionistaPage'));
const MedicoPage = lazy(() => import('./pages/MedicoPage'));

function App() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/no-autorizado" element={<NoAutorizado />} />

        {/* Rutas Privadas (Panel) */}
        <Route element={<DashboardLayout />}>
          
          {/* Dashboard principal (todos los roles logueados) */}
          <Route element={<ProtectedRoute />}>
             <Route path="/dashboard" element={<DashboardHome />} />
          </Route>

          {/* Rutas Específicas por Rol */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['recepcionista']} />}>
            <Route path="/recepcion" element={<RecepcionistaPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['medico']} />}>
            <Route path="/medico" element={<MedicoPage />} />
          </Route>
        
        </Route>

        {/* Redirigir al login por defecto si no hay ruta */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
