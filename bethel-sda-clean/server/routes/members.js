import express from 'express';
import { db } from '../db.js';
import { authRequired, permit } from '../middleware/auth.js';

const router = express.Router();
router.use(authRequired);

router.get('/', (req, res)=>{
  const q = (req.query.q||'').trim();
  let rows;
  if(q){
    rows = db.prepare(`
      SELECT * FROM members
      WHERE lower(first_name) LIKE ? OR lower(last_name) LIKE ? OR phone LIKE ?
      ORDER BY last_name, first_name
    `).all(`%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`, `%${q}%`);
  }else{
    rows = db.prepare('SELECT * FROM members ORDER BY last_name, first_name').all();
  }
  res.json(rows);
});

router.post('/', permit('admin','leader'), (req, res)=>{
  const { first_name, last_name, phone } = req.body;
  if(!first_name || !last_name) return res.status(400).json({ error: 'Missing names' });
  const info = db.prepare(`INSERT INTO members (first_name,last_name,phone) VALUES (?,?,?)`).run(first_name, last_name, phone);
  res.status(201).json(db.prepare('SELECT * FROM members WHERE id=?').get(info.lastInsertRowid));
});

export default router;
