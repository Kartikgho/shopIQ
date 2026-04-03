import { ReactNode } from 'react';

import { PushAlertsProvider } from '@/context/PushAlertsContext';
import { SearchHistoryProvider } from '@/context/SearchHistoryContext';
import { WishlistProvider } from '@/context/WishlistContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <PushAlertsProvider>
      <WishlistProvider>
        <SearchHistoryProvider>{children}</SearchHistoryProvider>
      </WishlistProvider>
    </PushAlertsProvider>
  );
}
