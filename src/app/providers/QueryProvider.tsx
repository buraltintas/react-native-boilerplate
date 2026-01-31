/**
 * App - Providers - Query Provider
 * 
 * React Query provider wrapper
 */

import React from 'react';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from '@shared/query';

interface Props {
  children: React.ReactNode;
}

export function QueryProvider({children}: Props) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default QueryProvider;
