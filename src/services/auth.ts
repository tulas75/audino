import { LoginCredentials, AuthResponse, User } from '../types/auth';

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3001/auth';

// Mock users for development
const MOCK_USERS = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    password: 'demo123'
  },
  {
    id: '2',
    email: 'test@test.com',
    name: 'Test User',
    password: 'test123'
  }
];

export class AuthService {
  private static instance: AuthService;
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // For development, use mock authentication
    if (!import.meta.env.VITE_USE_REAL_AUTH) {
      return this.mockLogin(credentials);
    }

    // Production API call
    const response = await fetch(`${AUTH_API_URL}/signin/email-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Login API error:', response.status, errorText);
      throw new Error(`Login failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);

    // Handle different possible response formats
    if (data.access_token || data.accessToken) {
      // Format 1: { access_token: "...", user: {...} }
      return {
        token: data.access_token || data.accessToken,
        user: data.user || data.profile || {
          id: data.user_id || data.userId || 'unknown',
          email: data.email || credentials.email,
          name: data.name || data.display_name || 'User'
        }
      };
    } else if (data.token) {
      // Format 2: { token: "...", user: {...} }
      return {
        token: data.token,
        user: data.user || {
          id: data.user_id || data.userId || 'unknown',
          email: data.email || credentials.email,
          name: data.name || data.display_name || 'User'
        }
      };
    } else {
      // Log the actual response format for debugging
      console.error('Unexpected response format:', data);
      throw new Error('Invalid response format from server');
    }
  }

  private async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = MOCK_USERS.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Generate a mock JWT token
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    // For development, use mock refresh
    if (!import.meta.env.VITE_USE_REAL_AUTH) {
      return this.mockRefreshToken(token);
    }

    // Production API call
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

  private async mockRefreshToken(token: string): Promise<AuthResponse> {
    // Validate the current token first
    const user = await this.mockValidateToken(token);
    
    // Generate a new mock token
    const newToken = `mock-jwt-token-${user.id}-${Date.now()}`;

    return {
      token: newToken,
      user
    };
  }

  async validateToken(token: string): Promise<User> {
    // For development, use mock validation
    if (!import.meta.env.VITE_USE_REAL_AUTH) {
      return this.mockValidateToken(token);
    }

    // Production API call
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

  private async mockValidateToken(token: string): Promise<User> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Extract user ID from mock token
    if (!token.startsWith('mock-jwt-token-')) {
      throw new Error('Invalid token');
    }

    const userId = token.split('-')[3];
    const user = MOCK_USERS.find(u => u.id === userId);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name
    };
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
