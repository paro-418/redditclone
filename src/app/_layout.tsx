import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider tokenCache={tokenCache}>
        <ClerkLoaded>
          <Slot />
        </ClerkLoaded>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
