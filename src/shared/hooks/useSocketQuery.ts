/**
 * Shared - Hooks - useSocketQuery
 * 
 * React Query integration with Socket events for cache invalidation
 */

import {useEffect, useCallback} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {socketService} from '@infra/socket';
import type {SocketEventHandler} from '@infra/socket';

interface SocketQueryConfig<T = any> {
  /**
   * Socket event to listen to
   */
  event: string;
  
  /**
   * Query keys to invalidate when event is received
   */
  queryKeys?: string[][];
  
  /**
   * Custom handler for the event
   * Return query keys to invalidate, or void
   */
  onEvent?: (data: T) => string[][] | void;
  
  /**
   * Whether to invalidate immediately or debounce
   */
  debounce?: number;
}

/**
 * Hook for invalidating React Query cache based on socket events
 */
export function useSocketQuery<T = any>(config: SocketQueryConfig<T>) {
  const queryClient = useQueryClient();
  const {event, queryKeys, onEvent, debounce} = config;

  const handleEvent = useCallback<SocketEventHandler<T>>(
    data => {
      // Call custom handler
      const customKeys = onEvent?.(data);
      
      // Determine which keys to invalidate
      const keysToInvalidate = customKeys || queryKeys || [];
      
      // Invalidate queries
      if (keysToInvalidate.length > 0) {
        const invalidate = () => {
          keysToInvalidate.forEach(key => {
            queryClient.invalidateQueries({queryKey: key});
          });
        };

        if (debounce) {
          setTimeout(invalidate, debounce);
        } else {
          invalidate();
        }
      }
    },
    [queryClient, queryKeys, onEvent, debounce],
  );

  useEffect(() => {
    const unsubscribe = socketService.on(event, handleEvent);
    return unsubscribe;
  }, [event, handleEvent]);
}

/**
 * Hook for multiple socket-query bindings
 */
export function useSocketQueries(configs: SocketQueryConfig[]) {
  configs.forEach(config => {
    useSocketQuery(config);
  });
}

/**
 * Hook for optimistic updates with socket events
 */
export function useSocketMutation<T = any>(
  event: string,
  queryKey: string[],
  updater: (oldData: any, newData: T) => any,
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = socketService.on<T>(event, data => {
      // Update query cache optimistically
      queryClient.setQueryData(queryKey, (oldData: any) => {
        return updater(oldData, data);
      });
    });

    return unsubscribe;
  }, [event, queryKey, queryClient, updater]);
}

/**
 * Pre-configured socket query invalidations for common patterns
 */
export const socketQueryPatterns = {
  /**
   * Invalidate list and detail on update
   */
  listAndDetail: (resource: string) => ({
    event: `${resource}:updated`,
    queryKeys: [[resource, 'list'], [resource, 'detail']],
  }),

  /**
   * Invalidate list on create
   */
  listOnCreate: (resource: string) => ({
    event: `${resource}:created`,
    queryKeys: [[resource, 'list']],
  }),

  /**
   * Invalidate all on delete
   */
  allOnDelete: (resource: string) => ({
    event: `${resource}:deleted`,
    queryKeys: [[resource]],
  }),
};

export default {
  useSocketQuery,
  useSocketQueries,
  useSocketMutation,
  socketQueryPatterns,
};
