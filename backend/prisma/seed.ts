import 'dotenv/config';
import { PrismaClient, TripRole, PlaceCategory } from '../src/generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.info('🔄 Resetting database...');
  await prisma.itineraryItem.deleteMany();
  await prisma.tripDay.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.place.deleteMany();
  await prisma.user.deleteMany();

  console.info('🌱 Seeding reference data...');

  const amani = await prisma.user.create({
    data: {
      email: 'amani@example.com',
      name: 'Amani Sakif',
      phone: '+1 555 111 2222',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
  });

  const neonBrew = await prisma.place.create({
    data: {
      name: 'Neon Brew Lab',
      description: 'Futuristic coffee tasting flight overlooking the city.',
      category: PlaceCategory.COFFEE,
      latitude: 13.7563,
      longitude: 100.5018,
      address: '59 Wireless Rd',
      city: 'Bangkok',
      country: 'Thailand',
    },
  });

  const lotusSanctuary = await prisma.place.create({
    data: {
      name: 'Lotus Sanctuary Hotel',
      description: 'Minimalist suites with sky garden infinity pool.',
      category: PlaceCategory.HOTEL,
      latitude: 7.8906,
      longitude: 98.3981,
      address: '88 Andaman Ave',
      city: 'Phuket',
      country: 'Thailand',
    },
  });

  const thailandEscape = await prisma.trip.create({
    data: {
      title: 'Thailand Escape',
      description: '10-day itinerary across Bangkok, Chiang Mai, and Phuket.',
      startDate: new Date('2025-02-10'),
      endDate: new Date('2025-02-20'),
      ownerId: amani.id,
      memberships: {
        create: {
          userId: amani.id,
          role: TripRole.OWNER,
          invitedAt: new Date(),
          joinedAt: new Date(),
        },
      },
      days: {
        create: [
          {
            date: new Date('2025-02-10'),
            position: 1,
            items: {
              create: [
                {
                  title: 'Sunrise coffee ritual',
                  notes: 'Try the nitro pandan latte.',
                  startTime: new Date('2025-02-10T08:00:00.000Z'),
                  endTime: new Date('2025-02-10T09:30:00.000Z'),
                  place: { connect: { id: neonBrew.id } },
                  assignedTo: { connect: { id: amani.id } },
                },
              ],
            },
          },
          {
            date: new Date('2025-02-12'),
            position: 2,
            items: {
              create: [
                {
                  title: 'Check-in + pool time',
                  notes: 'Book the sunset float session.',
                  startTime: new Date('2025-02-12T15:00:00.000Z'),
                  endTime: new Date('2025-02-12T18:00:00.000Z'),
                  place: { connect: { id: lotusSanctuary.id } },
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.favorite.create({
    data: {
      userId: amani.id,
      tripId: thailandEscape.id,
      placeId: neonBrew.id,
    },
  });

  await prisma.favorite.create({
    data: {
      userId: amani.id,
      tripId: thailandEscape.id,
      placeId: lotusSanctuary.id,
    },
  });

  console.info('✅ Seed complete');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
