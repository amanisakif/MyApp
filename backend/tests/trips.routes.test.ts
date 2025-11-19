import request from 'supertest';
import app from '../src/app';

jest.mock('../src/db/client', () => {
  const trip = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  };

  return { prisma: { trip } };
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockedDb = require('../src/db/client') as {
  prisma: {
    trip: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };
};

const prisma = mockedDb.prisma;

describe('trip routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists trips', async () => {
    prisma.trip.findMany.mockResolvedValue([
      {
        id: 'trip-1',
        title: 'Demo Trip',
        description: null,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        owner: { id: 'user-1', name: 'Amani', email: 'amani@example.com' },
        days: [{ id: 'day-1' }],
        memberships: [{ id: 'membership-1' }],
      },
    ]);

    const response = await request(app).get('/trips');

    expect(response.status).toBe(200);
    expect(response.body[0].title).toBe('Demo Trip');
    expect(prisma.trip.findMany).toHaveBeenCalled();
  });

  it('validates create payload', async () => {
    const response = await request(app).post('/trips').send({
      // missing required fields
    });

    expect(response.status).toBe(400);
  });

  it('creates trip', async () => {
    prisma.trip.create.mockResolvedValue({
      id: 'trip-1',
      title: 'Thailand',
      description: null,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      ownerId: 'user-1',
      owner: { id: 'user-1', name: 'Amani' },
      days: [],
      memberships: [],
    });

    const response = await request(app).post('/trips').send({
      title: 'Thailand',
      ownerId: '9d9a6a23-b624-4b8c-9f5d-0665f566fe7c',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      memberships: [{ userId: '61b3e0f1-7a8c-4a0c-9f92-9d8c4f7c1234', role: 'editor' }],
    });

    expect(response.status).toBe(201);
    expect(prisma.trip.create).toHaveBeenCalled();
  });
});

