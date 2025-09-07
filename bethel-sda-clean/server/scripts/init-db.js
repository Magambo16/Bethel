import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { db, runMigrations } from '../db.js';

dotenv.config();
runMigrations();

const name = process.env.ADMIN_NAME || 'Admin';
const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
const password = process.env.ADMIN_PASSWORD || 'ChangeMe!234';
const hash = bcrypt.hashSync(password, 10);

try{
  const exists = db.prepare('SELECT id FROM users WHERE email=?').get(email);
  if(!exists){
    db.prepare('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)')
      .run(name, email, hash, 'admin');
    console.log('✓ Admin user created:', email);
  }else{
    console.log('ℹ Admin already exists:', email);
  }

  const mcount = db.prepare('SELECT COUNT(*) as c FROM members').get().c;
  if(mcount === 0){
    const sample = [
      ['John','Okello','0772000001'],
      ['Grace','Nankya','0772000002'],
      ['Elder','Mugisha','0772000003'],
      ['Mary','Atwine','0772000004']
    ];
    const stmt = db.prepare('INSERT INTO members (first_name,last_name,phone) VALUES (?,?,?)');
    for(const row of sample) stmt.run(...row);
    console.log('✓ Sample members inserted');
  }

  console.log('✓ Database ready.');
}catch(e){
  console.error('Failed to create admin or seed:', e);
  process.exit(1);
}
process.exit(0);
