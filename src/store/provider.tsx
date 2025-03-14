// src/store/provider.tsx
'use client';

import { Provider } from 'react-redux';
import { makeStore } from './index';

export function ReduxStoreProviders({ children }: { children: React.ReactNode }) {
  const store = makeStore();

  return <Provider store={store}>{children}</Provider>;
}