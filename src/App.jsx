import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [datos, setDatos] = useState([])
  const [cargando, setCargando] = useState(false)

  // 1. CONFIGURACIÓN DE CONEXIÓN
  // Tu URL de Ngrok (La que termina en /api/datos)
  const API_URL = "https://unfantastically-wormish-jeni.ngrok-free.dev/api/datos"

  // Función para pedir los datos
  const obtenerDatos = async () => {
    try {
      // CONFIGURACIÓN MÁGICA PARA NGROK
      // Este header evita que Ngrok bloquee la petición con la pantalla de advertencia
      const config = {
        headers: {
          "ngrok-skip-browser-warning": "true", 
        }
      };

      // Hacemos la petición usando esa configuración
      const respuesta = await axios.get(API_URL, config)
      
      if (respuesta.data) {
        setDatos(respuesta.data)
      }
    } catch (error) {
      console.error("Error conectando al servidor:", error)
    }
  }

  // 2. ACTUALIZACIÓN AUTOMÁTICA (Cada 2 segundos)
  useEffect(() => {
    obtenerDatos() // Primera carga inmediata
    const intervalo = setInterval(obtenerDatos, 2000)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>🍅 Agro-Tech Monitor</h1>
        <div className="status-badge">
          <span className="dot"></span> En Vivo: Azure Cloud
        </div>
      </header>

      <main className="cards-grid">
        {datos.length === 0 ? (
          <p className="loading-text">Esperando datos de la cámara...</p>
        ) : (
          datos.map((item, index) => (
            <div 
              key={index} 
              className={`card ${item.analisis.calidad === 'PRIMERA' ? 'primera' : 'segunda'}`}
            >
              <div className="card-top">
                <span className="calidad-tag">{item.analisis.calidad}</span>
                <span className="hora">{item.hora}</span>
              </div>
              <h2>{item.analisis.madurez}</h2>
              <p>Sensor ID: {item.sensor_id}</p>
            </div>
          ))
        )}
      </main>
    </div>
  )
}

export default App