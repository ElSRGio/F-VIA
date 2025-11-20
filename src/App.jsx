import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// --- COMPONENTES ---
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MobileScanner from './components/MobileScanner';
import Users from './components/Users';

function App() {
  // --- ESTADOS ---
  const [currentUser, setCurrentUser] = useState(null); // Objeto usuario completo {username, role...}
  const [activeTab, setActiveTab] = useState('dashboard');
  const [datos, setDatos] = useState([]);

  // URL DE NGROK (Recuerda cambiarla si reinicias ngrok)
  const API_URL = "https://unfantastically-wormish-jeni.ngrok-free.dev/api/datos";

  // --- EFECTO INICIAL: Cargar sesión y asegurar Admin por defecto ---
  useEffect(() => {
    // 1. Recuperar sesión si recarga la página
    const sessionUser = localStorage.getItem('currentUser');
    if (sessionUser) {
      setCurrentUser(JSON.parse(sessionUser));
    }

    // 2. Asegurar que exista al menos el ADMIN en la "BD" local
    const storedUsers = JSON.parse(localStorage.getItem('agro_users')) || [];
    const adminExists = storedUsers.some(u => u.username === 'admin');
    
    if (!adminExists) {
      const defaultAdmin = { username: 'admin', password: 'admin', role: 'admin' };
      localStorage.setItem('agro_users', JSON.stringify([...storedUsers, defaultAdmin]));
      console.log("⚙️ Usuario Admin por defecto creado.");
    }
  }, []);

  // --- LÓGICA DE AUTENTICACIÓN ---
  const handleLogin = (username, password) => {
    const storedUsers = JSON.parse(localStorage.getItem('agro_users')) || [];
    
    // Buscar usuario que coincida
    const foundUser = storedUsers.find(u => u.username === username && u.password === password);

    if (foundUser) {
      setCurrentUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser)); // Persistir sesión
      setActiveTab('dashboard'); // Ir al inicio
    } else {
      alert("❌ Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setActiveTab('dashboard');
  };

  // --- OBTENCIÓN DE DATOS (POLLING) ---
  const obtenerDatos = async () => {
    try {
      const config = { headers: { "ngrok-skip-browser-warning": "true" } };
      const respuesta = await axios.get(API_URL, config);
      if (respuesta.data) setDatos(respuesta.data);
    } catch (error) {
      console.error("⚠️ Error conectando con API:", error);
      // No mostramos alerta al usuario para no interrumpir la UX, solo en consola
    }
  };

  useEffect(() => {
    if (currentUser && activeTab === 'dashboard') {
      obtenerDatos();
      const intervalo = setInterval(obtenerDatos, 2000); // Actualizar cada 2 seg
      return () => clearInterval(intervalo);
    }
  }, [currentUser, activeTab]);

  // --- RENDERIZADO ---

  // 1. Si no hay usuario, mostramos Login
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // 2. App Principal
  return (
    <div className="app-container">
      
      {/* Menú Lateral (Controla la navegación) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />

      {/* Contenido Principal */}
      <main className="main-content">
        
        {/* Cabecera simple móvil (El Sidebar tiene su propio botón, esto es decorativo o para desktop) */}
        <header className="mb-8 flex justify-between items-center md:ml-20">
           <div>
              <h1 className="text-2xl font-bold text-white">F-VIA Monitor</h1>
              <p className="text-gray-400 text-sm">
                Usuario: <span className="text-green-400 font-bold uppercase">{currentUser.username}</span> 
                {' '}({currentUser.role})
              </p>
           </div>
           <div className="hidden md:block">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs border border-green-500/30 animate-pulse">
                ● Sistema En Línea
              </span>
           </div>
        </header>

        {/* Vistas Dinámicas (Con margen izquierdo para desktop por el sidebar) */}
        <div className="md:ml-20 transition-all duration-300">
            
            {activeTab === 'dashboard' && (
              <Dashboard datos={datos} />
            )}

            {activeTab === 'scanner' && (
              <MobileScanner />
            )}

            {/* Solo renderiza Users si es admin (Doble protección: Visual y Lógica) */}
            {activeTab === 'users' && currentUser.role === 'admin' && (
              <Users />
            )}

        </div>
      </main>
    </div>
  );
}

export default App;