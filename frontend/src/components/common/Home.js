import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user, isAdmin } = useAuth();

  const servicios = [
    {
      icon: '🏠',
      title: 'Avalúos Comerciales',
      description: 'Valoración profesional de inmuebles comerciales bajo estándares nacionales e internacionales.'
    },
    {
      icon: '🏭',
      title: 'Avalúos Industriales',
      description: 'Evaluación técnica de activos industriales, maquinaria y equipos especializados.'
    },
    {
      icon: '💰',
      title: 'Valoración Financiera',
      description: 'Análisis integral del valor de empresas, marcas y activos intangibles.'
    },
    {
      icon: '📊',
      title: 'Consultoría Empresarial',
      description: 'Asesoría estratégica para la toma de decisiones y gestión patrimonial.'
    },
    {
      icon: '🚢',
      title: 'Importaciones',
      description: 'Gestión y asesoría en procesos de importación y comercio exterior.'
    },
    {
      icon: '📋',
      title: 'Otros Servicios',
      description: 'Soluciones personalizadas según las necesidades específicas de cada cliente.'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Bridge Solutions S.A.S.</h1>
            <p className="hero-subtitle">
              Especialistas en <strong>avalúos</strong>, <strong>valoración financiera</strong>, 
              <strong>consultoría empresarial</strong> e <strong>importaciones</strong>
            </p>
            <p className="hero-description">
              Ofrecemos soluciones técnicas y estratégicas para la gestión de activos y la toma de decisiones, 
              bajo estándares nacionales e internacionales.
            </p>
            <div className="hero-actions">
              {user ? (
                <Link 
                  to={isAdmin() ? '/admin' : '/dashboard'} 
                  className="btn btn-accent btn-lg"
                >
                  Ir a mi Panel
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-accent btn-lg">
                    Comenzar Ahora
                  </Link>
                  <Link to="/login" className="btn btn-outline-white btn-lg">
                    Iniciar Sesión
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section className="servicios-section">
        <div className="container">
          <h2 className="section-title">Nuestros Servicios</h2>
          <p className="section-subtitle">
            Soluciones integrales que generan confianza, precisión y respaldo técnico
          </p>
          
          <div className="servicios-grid">
            {servicios.map((servicio, index) => (
              <div key={index} className="servicio-card">
                <span className="servicio-icon">{servicio.icon}</span>
                <h3>{servicio.title}</h3>
                <p>{servicio.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="mision-vision-section">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card">
              <h2>🎯 Nuestra Misión</h2>
              <p>
                Ofrecer servicios integrales que generen confianza, precisión y respaldo técnico 
                para la toma de decisiones estratégicas, impulsando el crecimiento y la estabilidad 
                patrimonial de personas y organizaciones.
              </p>
            </div>
            <div className="mv-card">
              <h2>🔭 Nuestra Visión</h2>
              <p>
                Para 2030, ser líderes en Colombia y Latinoamérica en avalúos, valoración financiera 
                y consultoría empresarial, reconocidos por excelencia técnica, innovación y solidez profesional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>¿Necesitas una cotización?</h2>
          <p>Regístrate y solicita tu cotización personalizada hoy mismo</p>
          {!user && (
            <Link to="/register" className="btn btn-accent btn-lg">
              Crear Cuenta Gratis
            </Link>
          )}
          {user && !isAdmin() && (
            <Link to="/cotizaciones/nueva" className="btn btn-accent btn-lg">
              Solicitar Cotización
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="footer-logo">🌉</span>
              <div>
                <h3>Bridge Solutions S.A.S.</h3>
                <p>Construyendo puentes hacia el éxito empresarial</p>
              </div>
            </div>
            <div className="footer-links">
              <p>© {new Date().getFullYear()} Bridge Solutions S.A.S. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
