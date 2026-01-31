/**
 * Shared - Query Client
 * 
 * React Query setup and configuration
 */

import {QueryClient} from '@tanstack/react-query';
import {ApiError} from '@infra/api';
import crashReporter from '@infra/crash-reporter';

/**
 * Global error handler for React Query
 */
function handleQueryError(error: unknown) {
  if (error instanceof ApiError) {
    // Log API errors to crash reporter
    crashReporter.captureException(
      new Error(`API Error: ${error.message}`),
      {
        statusCode: error.statusCode,
        originalError: error.originalError,
      },
    );
  } else if (error instanceof Error) {
    crashReporter.captureException(error);
  }
}

/**
 * Create and configure React Query client
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      staleTime: 1000 * 60 * 5,
      // Cache time: 10 minutes
      gcTime: 1000 * 60 * 10,
      // Retry failed requests
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof ApiError && error.statusCode >= 400 && error.statusCode < 500) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      // Retry delay with exponential backoff
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus (web only, but doesn't hurt mobile)
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Refetch on mount if data is stale
      refetchOnMount: true,
    },
    mutations: {
      // Global mutation error handler
      onError: handleQueryError,
    },
  },
});

export default queryClient;
