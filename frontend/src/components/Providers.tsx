'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { AuthInitializer } from './AuthInitializer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
} 