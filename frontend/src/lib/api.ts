const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';

type RequestOptions = RequestInit & { skipAuth?: boolean };

async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || 'Request failed');
  }

  return response.json();
}

export type TripSummary = {
  id: string;
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  owner: {
    id: string;
    name?: string | null;
    email: string;
  };
  dayCount: number;
  memberCount: number;
};

export const fetchTrips = async (ownerId?: string): Promise<TripSummary[]> => {
  const params = ownerId ? `?ownerId=${ownerId}` : '';
  return apiFetch(`/trips${params}`);
};

export type Place = {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  city?: string | null;
  country?: string | null;
};

export const fetchPlaces = async (category?: string): Promise<Place[]> => {
  const params = category ? `?category=${category}` : '';
  const response = await apiFetch<{ places: Place[] }>(`/places${params}`);
  return response.places;
};

export type Favorite = {
  id: string;
  place: Place;
  createdAt: string;
};

export const fetchFavorites = async (userId: string): Promise<Favorite[]> => {
  const response = await apiFetch<{ favorites: Favorite[] }>(`/favorites?userId=${userId}`);
  return response.favorites;
};

export const createFavorite = async (userId: string, placeId: string, tripId?: string): Promise<Favorite> => {
  return apiFetch<Favorite>('/favorites', {
    method: 'POST',
    body: JSON.stringify({ userId, placeId, tripId }),
  });
};

export const deleteFavorite = async (favoriteId: string): Promise<void> => {
  await apiFetch(`/favorites/${favoriteId}`, { method: 'DELETE' });
};

export type DemoUser = {
  id: string;
  email: string;
  name?: string | null;
};

export const fetchDemoUser = async (): Promise<DemoUser> => {
  return apiFetch<DemoUser>('/demo-user');
};

