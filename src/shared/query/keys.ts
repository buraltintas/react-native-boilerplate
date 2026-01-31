/**
 * Shared - Query - Query Keys
 * 
 * Centralized query key factory
 * Helps with cache invalidation and organization
 */

export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    currentUser: () => [...queryKeys.auth.all, 'current-user'] as const,
  },

  // Animals
  animals: {
    all: ['animals'] as const,
    lists: () => [...queryKeys.animals.all, 'list'] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.animals.lists(), filters] as const,
    details: () => [...queryKeys.animals.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.animals.details(), id] as const,
  },

  // Add more domains as needed
  // appointments: { ... },
  // users: { ... },
} as const;

export default queryKeys;
