/**
 * Infra - API - Client
 * 
 * Fetch-based HTTP client with auth, refresh, and error handling
 */

import config from '@infra/config';
import {useAuthStore} from '@shared/store';
import {secureStorage} from '@infra/storage/secure';

// Typed error
export interface ApiError {
  message: string;
  statusCode?: number;
  code?: string;
  details?: any;
}

/**
 * Fetch wrapper with auth and error handling
 */
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.baseURL = config.api.baseUrl;
    this.timeout = config.api.timeout;
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const accessToken = useAuthStore.getState().accessToken;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(accessToken && {Authorization: `Bearer ${accessToken}`}),
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 - Token expired
      if (response.status === 401 && accessToken) {
        return await this.handleTokenRefresh(endpoint, options);
      }

      // Handle errors
      if (!response.ok) {
        const error = await this.parseError(response);
        throw error;
      }

      // Parse response
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw {
          message: 'Request timeout',
          statusCode: 408,
          code: 'TIMEOUT',
        } as ApiError;
      }

      throw error;
    }
  }

  /**
   * Handle token refresh
   */
  private async handleTokenRefresh<T>(
    endpoint: string,
    options: RequestInit,
  ): Promise<T> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      try {
        const refreshToken = await secureStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Call refresh endpoint
        const response = await fetch(`${this.baseURL}/auth/refresh`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({refreshToken}),
        });

        if (!response.ok) {
          throw new Error('Refresh failed');
        }

        const data = await response.json();
        const {accessToken: newAccessToken, refreshToken: newRefreshToken} = data;

        // Update tokens
        useAuthStore.getState().setAccessToken(newAccessToken);
        await secureStorage.setRefreshToken(newRefreshToken);

        this.isRefreshing = false;

        // Notify subscribers
        this.refreshSubscribers.forEach(callback => callback(newAccessToken));
        this.refreshSubscribers = [];

        // Retry original request
        return this.request(endpoint, options);
      } catch (error) {
        this.isRefreshing = false;
        this.refreshSubscribers = [];

        // Logout user
        useAuthStore.getState().logout();
        throw error;
      }
    }

    // Wait for refresh to complete
    return new Promise((resolve, reject) => {
      this.refreshSubscribers.push((token: string) => {
        this.request<T>(endpoint, options)
          .then(resolve)
          .catch(reject);
      });
    });
  }

  /**
   * Parse error response
   */
  private async parseError(response: Response): Promise<ApiError> {
    try {
      const data = await response.json();
      return {
        message: data.message || 'An error occurred',
        statusCode: response.status,
        code: data.code,
        details: data.details,
      };
    } catch {
      return {
        message: response.statusText || 'An error occurred',
        statusCode: response.status,
      };
    }
  }

  /**
   * HTTP Methods
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();

export default apiClient;
