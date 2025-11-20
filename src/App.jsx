import { useState, useEffect } from 'react'
import axios from 'axios'
import { Menu } from 'lucide-react'
import './App.css'

// --- IMPORTAMOS TUS NUEVOS COMPONENTES ---
// Asegúrate de que estos archivos existan en la carpeta src/components/
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import MobileScanner from './components/MobileScanner'

function App() {
  // --- ESTADOS ---
  const [usuario, setUsuario] = useState(null)    
  const [vista, setVista] = useState('dashboard') 
  const [datos, setDatos] = useState([])          
  const [menuAbierto, setMenuAbierto] = useState(false)

  // TU URL DE NGROK (La conservamos igual)
  const API_URL = "https://unfantastically-wormish-jeni.ngrok-free.dev/api/datos"

  // --- LÓGICA DE NEGOCIO ---
  
  const autenticarUsuario = (user, pass) => {
    // Credenciales simples para la expo
    if (user === 'admin' && pass === 'admin') {
      setUsuario(user)
    } else {
      alert("Credenciales incorrectas (Usa: admin / admin)")
    }
  }

  const obtenerDatos = async () => {
    try {
      // Header mágico para que Ngrok no bloquee
      const config = { headers: { "ngrok-skip-browser-warning": "true" } };
      
      const respuesta = await axios.get(API_URL, config)
      if (respuesta.data) setDatos(respuesta.data)
    } catch (error) {
      console.error("Error descargando datos:", error)
    }
  }

  // Actualización automática (Polling)
  useEffect(() => {
    if (usuario && vista === 'dashboard') {
      obtenerDatos()
      const intervalo = setInterval(obtenerDatos, 2000)
      return () => clearInterval(intervalo)
    }
  }, [usuario, vista])

  // --- RENDERIZADO ---

  // 1. PANTALLA DE LOGIN
  if (!usuario) {
    return <Login onLogin={autenticarUsuario} />
  }

  // 2. PANTALLA PRINCIPAL
  return (
    <div className="app-container">
      {/* Barra Superior */}
      <nav className="navbar">
        <div className="nav-brand">
          <button className="menu-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
            <Menu />
          </button>
          {/* Título personalizado */}
          <span>🍅 F-VIA Monitor</span>
        </div>
        <div className="user-info">Hola, {usuario}</div>
      </nav>

      {/* Menú Lateral */}
      <Sidebar 
        isOpen={menuAbierto} 
        setMenuAbierto={setMenuAbierto}
        vista={vista} 
        setVista={setVista}
        onLogout={() => setUsuario(null)}
      />

      {/* Contenido Dinámico */}
      <main className="main-content">
        {/* Si estamos en Dashboard, mostramos la etiqueta y la Tabla */}
        {vista === 'dashboard' && (
            <>
                <div className="status-badge" style={{marginBottom: '20px', display: 'inline-flex'}}>
                    <span className="dot"></span> En Vivo: Desde PC ELSRG
                </div>
                <Dashboard datos={datos} />
            </>
        )}
        
        {/* Si estamos en Cámara, mostramos el Escáner */}
        {vista === 'camara' && <MobileScanner />}
      </main>
    </div>
  )
}

export default App