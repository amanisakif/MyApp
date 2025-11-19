import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { tripRoleSchema } from '@myapp/shared';
import tripsRouter from './routes/trips';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/roles', (_req, res) => {
  res.json({ roles: tripRoleSchema.options });
});

app.use('/trips', tripsRouter);

export default app;

