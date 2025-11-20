import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { tripRoleSchema } from '@myapp/shared';
import tripsRouter from './routes/trips';
import placesRouter from './routes/places';
import favoritesRouter from './routes/favorites';

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

app.get('/demo-user', async (_req, res) => {
  const { prisma } = await import('./db/client');
  const user = await prisma.user.findFirst();
  if (!user) {
    return res.status(404).json({ error: 'No user found' });
  }
  res.json({ id: user.id, email: user.email, name: user.name });
});

app.use('/trips', tripsRouter);
app.use('/places', placesRouter);
app.use('/favorites', favoritesRouter);

export default app;

