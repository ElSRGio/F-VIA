import React, { useState, useEffect } from 'react';
import { Trash2, UserPlus, Shield, User, Save } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
  const [error, setError] = useState('');

  // Cargar usuarios al iniciar
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('agro_users')) || [];
    setUsers(storedUsers);
  }, []);

  // Función para agregar usuario
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Validar que no exista ya
    if (users.some(u => u.username === newUser.username)) {
      setError('El usuario ya existe');
      return;
    }

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('agro_users', JSON.stringify(updatedUsers));
    
    // Reset form
    setNewUser({ username: '', password: '', role: 'user' });
    setError('');
  };

  // Función para borrar usuario
  const handleDelete = (usernameToDelete) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Protección: No te puedes borrar a ti mismo
    if (currentUser.username === usernameToDelete) {
      alert("No puedes eliminar tu propio usuario mientras estás conectado.");
      return;
    }

    if (window.confirm(`¿Seguro que deseas eliminar a ${usernameToDelete}?`)) {
      const filteredUsers = users.filter(u => u.username !== usernameToDelete);
      setUsers(filteredUsers);
      localStorage.setItem('agro_users', JSON.stringify(filteredUsers));
    }
  };

  return (
    <div className="p-6 md:p-12 w-full max-w-6xl mx-auto animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Gestión de Usuarios</h2>
        <p className="text-gray-400">Administra quién tiene acceso a F-VIA Monitor.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- COLUMNA 1: FORMULARIO DE CREACIÓN --- */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3 mb-6 text-green-400">
              <UserPlus />
              <h3 className="text-xl font-semibold">Nuevo Usuario</h3>
            </div>

            <form onSubmit={handleAddUser} className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Nombre de Usuario</label>
                <input 
                  type="text" 
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-green-500 outline-none transition-colors"
                  placeholder="Ej. operador1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Contraseña</label>
                <input 
                  type="password" 
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-green-500 outline-none transition-colors"
                  placeholder="••••••"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Rol / Permisos</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-green-500 outline-none transition-colors"
                >
                  <option value="user">Usuario (Solo Ver)</option>
                  <option value="admin">Administrador (Control Total)</option>
                </select>
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <button 
                type="submit"
                className="mt-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-3 rounded-xl transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2"
              >
                <Save size={18} /> Guardar Usuario
              </button>
            </form>
          </div>
        </div>

        {/* --- COLUMNA 2: LISTA DE USUARIOS --- */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white">Usuarios Registrados ({users.length})</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead className="text-xs uppercase bg-black/20 text-gray-400">
                  <tr>
                    <th className="px-6 py-4">Usuario</th>
                    <th className="px-6 py-4">Rol</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u, index) => (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                          {u.role === 'admin' ? <Shield size={14} className="text-yellow-400" /> : <User size={14} />}
                        </div>
                        {u.username}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          u.role === 'admin' 
                          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {u.role === 'admin' ? 'ADMINISTRADOR' : 'OPERADOR'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(u.username)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Eliminar usuario"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                        No hay usuarios registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Users;