/**
 * Shared - Store - Persistence
 * 
 * Versioned persistence with migrations for Zustand
 */

import {StateStorage} from 'zustand/middleware';
import storage from '@infra/storage';

export interface PersistedState {
  version: number;
  state: any;
}

export type Migration = (state: any) => any;

export interface PersistenceConfig {
  version: number;
  migrations?: Record<number, Migration>;
  blacklist?: string[];
  whitelist?: string[];
}

/**
 * Create a versioned storage adapter
 */
export function createVersionedStorage(config: PersistenceConfig): StateStorage {
  return {
    getItem: async (name: string): Promise<string | null> => {
      try {
        const item = await storage.getItem(name);
        if (!item) {
          return null;
        }

        const persisted: PersistedState = JSON.parse(item);

        // Run migrations if needed
        if (persisted.version < config.version && config.migrations) {
          let migratedState = persisted.state;

          for (let v = persisted.version + 1; v <= config.version; v++) {
            const migration = config.migrations[v];
            if (migration) {
              migratedState = migration(migratedState);
            }
          }

          // Save migrated state
          const newPersisted: PersistedState = {
            version: config.version,
            state: migratedState,
          };

          await storage.setItem(name, JSON.stringify(newPersisted));

          return JSON.stringify(migratedState);
        }

        return JSON.stringify(persisted.state);
      } catch (error) {
        console.error('[Persistence] Error getting item:', error);
        return null;
      }
    },

    setItem: async (name: string, value: string): Promise<void> => {
      try {
        const state = JSON.parse(value);

        // Apply blacklist/whitelist
        let filteredState = state;

        if (config.whitelist && config.whitelist.length > 0) {
          filteredState = {};
          for (const key of config.whitelist) {
            if (key in state) {
              filteredState[key] = state[key];
            }
          }
        } else if (config.blacklist && config.blacklist.length > 0) {
          filteredState = {...state};
          for (const key of config.blacklist) {
            delete filteredState[key];
          }
        }

        const persisted: PersistedState = {
          version: config.version,
          state: filteredState,
        };

        await storage.setItem(name, JSON.stringify(persisted));
      } catch (error) {
        console.error('[Persistence] Error setting item:', error);
      }
    },

    removeItem: async (name: string): Promise<void> => {
      try {
        await storage.removeItem(name);
      } catch (error) {
        console.error('[Persistence] Error removing item:', error);
      }
    },
  };
}
