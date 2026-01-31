/**
 * Infra - API - Animals Module
 * 
 * Animals-related API calls (example domain)
 */

import {apiClient} from './client';

export interface Animal {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  ownerId: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnimalRequest {
  name: string;
  species: string;
  breed?: string;
  age?: number;
}

export interface UpdateAnimalRequest {
  name?: string;
  species?: string;
  breed?: string;
  age?: number;
}

export const animalsApi = {
  /**
   * Get all animals
   */
  getAll: () => {
    return apiClient.get<Animal[]>('/animals');
  },

  /**
   * Get animal by ID
   */
  getById: (id: string) => {
    return apiClient.get<Animal>(`/animals/${id}`);
  },

  /**
   * Create animal
   */
  create: (data: CreateAnimalRequest) => {
    return apiClient.post<Animal>('/animals', data);
  },

  /**
   * Update animal
   */
  update: (id: string, data: UpdateAnimalRequest) => {
    return apiClient.patch<Animal>(`/animals/${id}`, data);
  },

  /**
   * Delete animal
   */
  delete: (id: string) => {
    return apiClient.delete(`/animals/${id}`);
  },
};

export default animalsApi;
