import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ScanLine, Users, LogOut, Menu, X } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 1. Leemos quién está conectado para saber si mostrar el botón
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Monitor', icon: LayoutDashboard, showAlways: true },
    { id: 'scanner', label: 'Escáner Móvil', icon: ScanLine, showAlways: true },
    // 2. Solo mostramos 'Usuarios' si el rol es 'admin'
    { 
      id: 'users', 
      label: 'Gestión Usuarios', 
      icon: Users, 
      showAlways: false, 
      restricted: true 
    },
  ];

  return (
    <>
      {/* Botón móvil hamburguesa */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 bg-white/10 backdrop-blur-md rounded-lg md:hidden text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      <div className={`fixed left-0 top-0 h-full bg-black/40 backdrop-blur-xl border-r border-white/10 text-white transition-all duration-300 z-40 
        ${isOpen ? 'w-64' : 'w-0 -translate-x-full md:translate-x-0 md:w-20'} 
        flex flex-col`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
            <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
            {isOpen && <h1 className="font-bold text-xl tracking-wider">F-VIA <span className="text-green-400">Monitor</span></h1>}
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
          {menuItems.map((item) => {
            // Lógica de seguridad visual
            if (item.restricted && currentUser?.role !== 'admin') return null;

            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); if(window.innerWidth < 768) setIsOpen(false); }}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200
                  ${activeTab === item.id 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.2)]' 
                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                  }`}
              >
                <item.icon size={24} />
                <span className={`whitespace-nowrap transition-all duration-300 ${!isOpen && 'md:opacity-0 md:w-0 overflow-hidden'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
            <button 
                onClick={onLogout}
                className="flex items-center gap-4 p-3 text-red-400 hover:bg-red-500/10 rounded-xl w-full transition-colors"
            >
                <LogOut size={24} />
                {isOpen && <span>Cerrar Sesión</span>}
            </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;