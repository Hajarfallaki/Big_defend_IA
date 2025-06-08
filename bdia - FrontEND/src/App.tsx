import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Transactions from './pages/Transactions';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/dashboard" />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="clients" element={<div className="p-6">Page Clients (à développer)</div>} />
        <Route path="analytics" element={<div className="p-6">Page Analytics (à développer)</div>} />
        <Route path="models" element={<div className="p-6">Page Modèles IA (à développer)</div>} />
        <Route path="settings" element={<div className="p-6">Page Paramètres (à développer)</div>} />
        <Route path="my-transactions" element={<div className="p-6">Mes Transactions (à développer)</div>} />
        <Route path="security" element={<div className="p-6">Page Sécurité (à développer)</div>} />
        <Route path="reports" element={<div className="p-6">Page Rapports (à développer)</div>} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;