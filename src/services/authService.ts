import { apiClient, fetchWithFallback } from './api';
import { demoUsers } from '../data/demoData';
import type { User, UserRole } from '../types';

export interface LoginCredentials {
  email: string;
  password?: string;
  role?: UserRole;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone: string;
  location: string;
  organization?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Authentication Service
 * Pre-configured for Member 3 (Backend + MongoDB + Cloud) to connect /api/auth endpoints.
 */
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Attempt real backend call
    return fetchWithFallback<AuthResponse>(
      () => apiClient.post('/auth/login', credentials),
      // Fallback to matching demo user or role-based demo user
      (() => {
        const found = demoUsers.find(
          (u) =>
            u.email.toLowerCase() === credentials.email.toLowerCase() ||
            (credentials.role && u.role === credentials.role)
        ) || demoUsers[0];

        return {
          user: found as User,
          token: 'demo-jwt-token-' + found.id + '-' + Date.now(),
        };
      })()
    );
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    return fetchWithFallback<AuthResponse>(
      () => apiClient.post('/auth/register', data),
      {
        user: {
          id: 'user-' + Date.now(),
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone,
          location: data.location,
          organization: data.organization || '',
          verifiedStatus: false,
        },
        token: 'demo-jwt-token-new-' + Date.now(),
      }
    );
  },

  async getCurrentUser(): Promise<User | null> {
    const rawUser = localStorage.getItem('agrisync_auth_user');
    if (!rawUser) return null;
    try {
      return JSON.parse(rawUser) as User;
    } catch {
      return null;
    }
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    return fetchWithFallback<{ success: boolean; message: string }>(
      () => apiClient.post('/auth/forgot-password', { email }),
      {
        success: true,
        message: `Password reset instructions have been dispatched to ${email}`,
      }
    );
  },

  logout(): void {
    localStorage.removeItem('agrisync_auth_token');
    localStorage.removeItem('agrisync_auth_user');
  },
};

export default authService;
