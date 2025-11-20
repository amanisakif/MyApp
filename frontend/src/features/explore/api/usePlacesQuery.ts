import { useQuery } from '@tanstack/react-query';
import { fetchPlaces, Place } from '../../../lib/api';

export const usePlacesQuery = (category?: string) => {
  return useQuery<Place[]>({
    queryKey: ['places', category],
    queryFn: () => fetchPlaces(category),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

