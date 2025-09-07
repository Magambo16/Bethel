import React, { useState } from 'react'

export default function Login({ onLogin }){
  const [email, setEmail] = useState('admin@bethel.local');
  const [password, setPassword] = useState('ChangeMe!234');
  const [err, setErr] = useState('');

  async function handleLogin(e){
    e.preventDefault();
    setErr('');
    try{
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || 'Login failed');
      onLogin(data);
    }catch(e){
      setErr(e.message);
    }
  }

  return (
    <div style={{display:'grid',placeItems:'center',minHeight:'100vh',padding:16}}>
      <div style={{maxWidth:420,width:'100%'}} className="card">
        <div style={{textAlign:'center'}}>
          <img src="/sda_logo.png" alt="logo" style={{height:72}} />
          <h2>Bethel SDA Church</h2>
          <p>Membership system</p>
        </div>
        <form onSubmit={handleLogin} style={{display:'grid',gap:8}}>
          <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required /></label>
          <label>Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" required /></label>
          {err && <div style={{color:'red'}}>{err}</div>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
