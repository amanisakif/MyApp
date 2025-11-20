import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/client';
import { PlaceCategory } from '../generated/prisma/client';

const router = Router();

const categorySchema = z.nativeEnum(PlaceCategory).optional();

router.get('/', async (req, res) => {
  try {
    const category = categorySchema.parse(req.query.category);
    
    const places = await prisma.place.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      places: places.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        latitude: p.latitude,
        longitude: p.longitude,
        address: p.address,
        city: p.city,
        country: p.country,
      })),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid category filter' });
    }
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const place = await prisma.place.findUnique({
      where: { id: req.params.id },
    });

    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }

    res.json({
      id: place.id,
      name: place.name,
      description: place.description,
      category: place.category,
      latitude: place.latitude,
      longitude: place.longitude,
      address: place.address,
      city: place.city,
      country: place.country,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch place' });
  }
});

export default router;

