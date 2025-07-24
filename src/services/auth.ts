import { LoginCredentials, AuthResponse, User } from '../types/auth';

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3001/auth';

export class AuthService {
  private static instance: AuthService;
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_API_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  }

  async validateToken(token: string): Promise<User> {
    const response = await fetch(`${AUTH_API_URL}/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token validation failed');
    }

    return response.json();
  }

  storeToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
  }
}
