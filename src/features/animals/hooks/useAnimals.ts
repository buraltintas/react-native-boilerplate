/**
 * Features - Animals - Hooks
 * 
 * React Query hooks for animals operations
 */

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {animalsApi, CreateAnimalRequest, UpdateAnimalRequest} from '@infra/api';
import {queryKeys} from '@shared/query';

/**
 * Get all animals
 */
export function useAnimals() {
  return useQuery({
    queryKey: queryKeys.animals.lists(),
    queryFn: () => animalsApi.getAll(),
  });
}

/**
 * Get animal by ID
 */
export function useAnimal(id: string) {
  return useQuery({
    queryKey: queryKeys.animals.detail(id),
    queryFn: () => animalsApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Create animal mutation
 */
export function useCreateAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnimalRequest) => animalsApi.create(data),
    onSuccess: () => {
      // Invalidate animals list to refetch
      queryClient.invalidateQueries({queryKey: queryKeys.animals.lists()});
    },
  });
}

/**
 * Update animal mutation
 */
export function useUpdateAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: UpdateAnimalRequest}) =>
      animalsApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific animal and list
      queryClient.invalidateQueries({queryKey: queryKeys.animals.detail(variables.id)});
      queryClient.invalidateQueries({queryKey: queryKeys.animals.lists()});
    },
  });
}

/**
 * Delete animal mutation
 */
export function useDeleteAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => animalsApi.delete(id),
    onSuccess: () => {
      // Invalidate list
      queryClient.invalidateQueries({queryKey: queryKeys.animals.lists()});
    },
  });
}
