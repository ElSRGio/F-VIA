import React from 'react'

const Login = ({ onLogin }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    const user = e.target.username.value
    const pass = e.target.password.value
    onLogin(user, pass)
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1>🍅 Agro-System ERP</h1>
        <p>Acceso Corporativo</p>
        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Usuario" autoComplete="off"/>
          <input name="password" type="password" placeholder="Contraseña" />
          <button type="submit">INICIAR SESIÓN</button>
        </form>
      </div>
    </div>
  )
}

export default Login