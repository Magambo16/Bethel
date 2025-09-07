import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import memberRoutes from './routes/members.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
app.use(cors({
  origin: function(origin, cb){
    if(!origin) return cb(null, true);
    if(allowed.indexOf(origin) !== -1) return cb(null, true);
    return cb(null, false);
  },
  credentials: true
}));
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// serve client build
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get('/api/health', (_req, res)=> res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
