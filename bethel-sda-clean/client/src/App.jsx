import React, { useState } from 'react'
import Login from './pages/Login.jsx'
import Members from './pages/Members.jsx'

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  function onLogin({ token, user }){
    setToken(token); setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
  function logout(){
    localStorage.removeItem('token'); localStorage.removeItem('user');
    setToken(''); setUser(null);
  }

  if(!token) return <Login onLogin={onLogin} />;

  return (
    <div className="app">
      <header className="header">
        <img src="/sda_logo.png" alt="logo" className="logo" />
        <h1>Bethel SDA Church Membership System</h1>
        <div className="spacer" />
        <div className="user">{user?.name} ({user?.role}) <button onClick={logout}>Logout</button></div>
      </header>
      <main className="container">
        <Members token={token} user={user} />
      </main>
    </div>
  )
}
