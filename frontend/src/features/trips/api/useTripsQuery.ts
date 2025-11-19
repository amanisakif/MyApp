import { useQuery } from '@tanstack/react-query';
import { fetchTrips, TripSummary } from '../../../lib/api';

export const tripsKeys = {
  all: ['trips'] as const,
  list: (ownerId?: string) => [...tripsKeys.all, ownerId ?? 'all'] as const,
};

export const useTripsQuery = (ownerId?: string) =>
  useQuery<TripSummary[]>({
    queryKey: tripsKeys.list(ownerId),
    queryFn: () => fetchTrips(ownerId),
    staleTime: 1000 * 60 * 5, // 5 minutes to avoid unnecessary API calls
  });

