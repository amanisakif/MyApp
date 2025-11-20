import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFavorites, createFavorite, deleteFavorite, Favorite, fetchDemoUser } from '../../../lib/api';

const getDemoUserId = async (): Promise<string> => {
  const user = await fetchDemoUser();
  return user.id;
};

export const useFavoritesQuery = () => {
  return useQuery<Favorite[]>({
    queryKey: ['favorites'],
    queryFn: async () => {
      const userId = await getDemoUserId();
      return fetchFavorites(userId);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ placeId, tripId }: { placeId: string; tripId?: string }) => {
      const userId = await getDemoUserId();
      return createFavorite(userId, placeId, tripId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

export const useDeleteFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (favoriteId: string) => deleteFavorite(favoriteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

