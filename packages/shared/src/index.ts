import { z } from 'zod';

export const tripRoleSchema = z.enum(['owner', 'editor', 'viewer']);
export type TripRole = z.infer<typeof tripRoleSchema>;

export const memberSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  tripId: z.string().uuid(),
  role: tripRoleSchema,
  invitedAt: z.string().datetime(),
});

export type Member = z.infer<typeof memberSchema>;

