import React, { useEffect, useState } from 'react'

export default function Members({ token, user }){
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ first_name:'', last_name:'', phone:'' });

  async function load(){
    const url = q ? `/api/members?q=${encodeURIComponent(q)}` : '/api/members';
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }});
    if(res.ok){ const data = await res.json(); setList(data); }
  }
  useEffect(()=>{ load(); }, [q]);

  async function addMember(e){
    e.preventDefault();
    const res = await fetch('/api/members', {
      method:'POST',
      headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
      body: JSON.stringify(form)
    });
    if(res.ok){ setForm({ first_name:'', last_name:'', phone:'' }); load(); }
    else { const d = await res.json(); alert(d.error || 'Failed'); }
  }

  return (
    <div style={{display:'grid',gap:12}}>
      <div style={{display:'flex',gap:8}}>
        <input placeholder="Search members..." value={q} onChange={e=>setQ(e.target.value)} style={{flex:1}} />
        <button onClick={load}>Search</button>
      </div>

      <form onSubmit={addMember} className="card" style={{display:'grid',gap:8}}>
        <h3>Add Member</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <input placeholder="First name" value={form.first_name} onChange={e=>setForm(f=>({ ...f, first_name:e.target.value }))} required />
          <input placeholder="Last name" value={form.last_name} onChange={e=>setForm(f=>({ ...f, last_name:e.target.value }))} required />
          <input placeholder="Phone" value={form.phone} onChange={e=>setForm(f=>({ ...f, phone:e.target.value }))} />
        </div>
        <button type="submit">Save</button>
      </form>

      <div className="card">
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr><th>#</th><th>Name</th><th>Phone</th></tr>
          </thead>
          <tbody>
            {list.map((m,i)=>(
              <tr key={m.id}><td>{i+1}</td><td>{m.first_name} {m.last_name}</td><td>{m.phone||''}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
