import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/client';

const router = Router();

const createFavoriteSchema = z.object({
  userId: z.string().uuid(),
  placeId: z.string().uuid(),
  tripId: z.string().uuid().optional(),
});

router.get('/', async (req, res) => {
  try {
    const userId = z.string().uuid().parse(req.query.userId);
    
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        place: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      favorites: favorites.map((f) => ({
        id: f.id,
        place: {
          id: f.place.id,
          name: f.place.name,
          description: f.place.description,
          category: f.place.category,
          latitude: f.place.latitude,
          longitude: f.place.longitude,
          address: f.place.address,
          city: f.place.city,
          country: f.place.country,
        },
        createdAt: f.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid userId' });
    }
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = createFavoriteSchema.parse(req.body);
    
    const favorite = await prisma.favorite.create({
      data,
      include: {
        place: true,
      },
    });

    res.status(201).json({
      id: favorite.id,
      place: {
        id: favorite.place.id,
        name: favorite.place.name,
        description: favorite.place.description,
        category: favorite.place.category,
        latitude: favorite.place.latitude,
        longitude: favorite.place.longitude,
        address: favorite.place.address,
        city: favorite.place.city,
        country: favorite.place.country,
      },
      createdAt: favorite.createdAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return res.status(409).json({ error: 'Place already favorited' });
    }
    res.status(500).json({ error: 'Failed to create favorite' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.favorite.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    res.status(500).json({ error: 'Failed to delete favorite' });
  }
});

export default router;

