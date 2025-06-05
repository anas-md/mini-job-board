'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { AuthInitializer } from './AuthInitializer';
import { ThemeProvider } from './theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthInitializer />
        {children}
      </ThemeProvider>
    </Provider>
  );
} 