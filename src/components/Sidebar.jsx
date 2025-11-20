import React from 'react'
import { LayoutDashboard, Camera, LogOut } from 'lucide-react'

const Sidebar = ({ isOpen, setVista, vista, setMenuAbierto, onLogout }) => {
  const handleNavigation = (nuevaVista) => {
    setVista(nuevaVista)
    setMenuAbierto(false) // Cierra el menú al seleccionar en móvil
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button 
        onClick={() => handleNavigation('dashboard')} 
        className={vista === 'dashboard' ? 'active' : ''}
      >
        <LayoutDashboard size={20}/> Tablero de Datos
      </button>
      
      <button 
        onClick={() => handleNavigation('camara')} 
        className={vista === 'camara' ? 'active' : ''}
      >
        <Camera size={20}/> Escáner Móvil IA
      </button>
      
      <button onClick={onLogout} className="logout-btn">
        <LogOut size={20}/> Cerrar Sesión
      </button>
    </div>
  )
}

export default Sidebar