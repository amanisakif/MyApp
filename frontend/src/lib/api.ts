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

