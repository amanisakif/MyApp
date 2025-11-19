
import { Router } from 'express';
import { z } from 'zod';
import { TripRole } from '../generated/prisma/client';
import { prisma } from '../db/client';
import { tripRoleSchema } from '@myapp/shared';

const tripsRouter = Router();

const createItineraryItemSchema = z.object({
  title: z.string().min(1),
  notes: z.string().optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  placeId: z.string().uuid().optional(),
  assignedToId: z.string().uuid().optional(),
});

const createTripDaySchema = z.object({
  date: z.string().datetime(),
  position: z.number().int().min(1).optional(),
  items: z.array(createItineraryItemSchema).optional(),
});

const createMembershipSchema = z.object({
  userId: z.string().uuid(),
  role: tripRoleSchema.default('editor'),
});

const createTripSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  ownerId: z.string().uuid(),
  memberships: z.array(createMembershipSchema).optional().default([]),
  days: z.array(createTripDaySchema).optional().default([]),
});

const tripListQuerySchema = z.object({
  ownerId: z.string().uuid().optional(),
});

tripsRouter.get('/', async (req, res) => {
  try {
    const { ownerId } = tripListQuerySchema.parse(req.query);
    const trips = await prisma.trip.findMany({
      where: ownerId ? { ownerId } : undefined,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        days: {
          select: { id: true },
        },
        memberships: {
          select: { id: true },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    res.json(
      trips.map((trip) => ({
        id: trip.id,
        title: trip.title,
        description: trip.description,
        startDate: trip.startDate,
        endDate: trip.endDate,
        owner: trip.owner,
        dayCount: trip.days.length,
        memberCount: trip.memberships.length,
      })),
    );
  } catch (error) {
    console.error('[GET /trips] failed', error);
    res.status(500).json({ message: 'Unable to fetch trips' });
  }
});

tripsRouter.get('/:id', async (req, res) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: {
        owner: true,
        memberships: {
          include: { user: true },
        },
        days: {
          include: {
            items: {
              include: { place: true, assignedTo: true },
              orderBy: { startTime: 'asc' },
            },
          },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    console.error('[GET /trips/:id] failed', error);
    res.status(500).json({ message: 'Unable to fetch trip' });
  }
});

tripsRouter.post('/', async (req, res) => {
  try {
    const payload = createTripSchema.parse(req.body);

    const trip = await prisma.trip.create({
      data: {
        title: payload.title,
        description: payload.description,
        startDate: new Date(payload.startDate),
        endDate: new Date(payload.endDate),
        ownerId: payload.ownerId,
        memberships: {
          create: [
            {
              userId: payload.ownerId,
              role: TripRole.OWNER,
              invitedAt: new Date(),
              joinedAt: new Date(),
            },
            ...payload.memberships
              .filter((member) => member.userId !== payload.ownerId)
              .map((member) => ({
                userId: member.userId,
                role: member.role.toUpperCase() as TripRole,
                invitedAt: new Date(),
              })),
          ],
        },
        days: {
          create: payload.days.map((day, index) => ({
            date: new Date(day.date),
            position: day.position ?? index + 1,
            items: day.items
              ? {
                  create: day.items.map((item) => ({
                    title: item.title,
                    notes: item.notes,
                    startTime: item.startTime ? new Date(item.startTime) : undefined,
                    endTime: item.endTime ? new Date(item.endTime) : undefined,
                    placeId: item.placeId,
                    assignedToId: item.assignedToId,
                  })),
                }
              : undefined,
          })),
        },
      },
      include: {
        owner: true,
        days: {
          include: { items: true },
        },
        memberships: true,
      },
    });

    res.status(201).json(trip);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid payload', issues: error.issues });
    }

    console.error('[POST /trips] failed', error);
    res.status(500).json({ message: 'Unable to create trip' });
  }
});

export default tripsRouter;
