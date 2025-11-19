import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppNavigator } from './navigation/AppNavigator';

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppNavigator />
  </QueryClientProvider>
);

