import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './styles/variables.css';

// Common Components
import Navbar from './components/common/Navbar';
import Home from './components/common/Home';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// User Components
import Dashboard from './components/user/Dashboard';
import CotizacionesList from './components/user/CotizacionesList';
import CotizacionDetail from './components/user/CotizacionDetail';
import CotizacionForm from './components/user/CotizacionForm';
import Profile from './components/user/Profile';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import AdminCotizaciones from './components/admin/AdminCotizaciones';
import AdminCotizacionDetail from './components/admin/AdminCotizacionDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/cotizaciones" element={
                <ProtectedRoute>
                  <CotizacionesList />
                </ProtectedRoute>
              } />
              <Route path="/cotizaciones/nueva" element={
                <ProtectedRoute>
                  <CotizacionForm />
                </ProtectedRoute>
              } />
              <Route path="/cotizaciones/:id" element={
                <ProtectedRoute>
                  <CotizacionDetail />
                </ProtectedRoute>
              } />
              <Route path="/cotizaciones/:id/editar" element={
                <ProtectedRoute>
                  <CotizacionForm />
                </ProtectedRoute>
              } />
              <Route path="/perfil" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* Admin Protected Routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/cotizaciones" element={
                <ProtectedRoute adminOnly>
                  <AdminCotizaciones />
                </ProtectedRoute>
              } />
              <Route path="/admin/cotizaciones/:id" element={
                <ProtectedRoute adminOnly>
                  <AdminCotizacionDetail />
                </ProtectedRoute>
              } />

              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
