import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from './utils/routes';

const queryClient = new QueryClient();

// Needed for TanStackQuery DevTools
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient;
  }
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider />
    </QueryClientProvider>
  );
};

export default App;
