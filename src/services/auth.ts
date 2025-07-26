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
      const response = await this.mockLogin(credentials);
      this.storeToken(response.token);
      this.authenticateMAUI(response.user.email).catch(console.error);
      return response;
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

    let authResponse: AuthResponse;
    // Handle the actual API response format
    if (data.session && data.session.accessToken && data.session.user) {
      authResponse = {
        token: data.session.accessToken,
        user: {
          id: data.session.user.id,
          email: data.session.user.email,
          name: data.session.user.displayName || data.session.user.email
        }
      };
    } else if (data.accessToken) {
      // Fallback for direct accessToken format
      authResponse = {
        token: data.accessToken,
        user: data.user || {
          id: data.user?.id || 'unknown',
          email: data.user?.email || credentials.email,
          name: data.user?.displayName || data.user?.name || 'User'
        }
      };
    } else {
      // Log the actual response format for debugging
      console.error('Unexpected response format:', data);
      throw new Error('Invalid response format from server');
    }

    this.storeToken(authResponse.token);
    this.authenticateMAUI(authResponse.user.email).catch(console.error);
    return authResponse;
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

  private async authenticateMAUI(userEmail: string): Promise<void> {
    const mauiBaseUrl = import.meta.env.VITE_MAUI_API_URL;
    if (!mauiBaseUrl) {
      console.error('VITE_MAUI_API_URL is not set');
      return;
    }

    const apiKey = localStorage.getItem('pandas_dino_api_key');
    if (apiKey) {
      // GET call to /getusertoken
      const url = new URL(`${mauiBaseUrl}/getusertoken`);
      url.searchParams.append('api_key', apiKey);
      url.searchParams.append('user_email', userEmail);

      try {
        const response = await fetch(url.toString());
        if (response.ok) {
          const tokens = response.headers.get('TOKENS');
          console.log(`TOKENS: ${tokens}`);
        } else {
          console.error('Failed to get user token from MAUI');
        }
      } catch (error) {
        console.error('Error during GET to MAUI /getusertoken', error);
      }
    } else {
      // POST call to /checkpandinouser
      const token = this.getStoredToken();
      if (!token) {
        console.error('No auth token available');
        return;
      }

      const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT;
      if (!graphqlEndpoint) {
        console.error('VITE_GRAPHQL_ENDPOINT is not set');
        return;
      }

      try {
        const response = await fetch(`${mauiBaseUrl}/checkpandinouser`, {
          method: 'POST',
          headers: {
            'X-USER-EMAIL': userEmail,
            'X-AUTH-TOKEN': token,
            'X-GRAPHQL-URL': graphqlEndpoint
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Response from /checkpandinouser:', data);
          if (data.api_key) {
            localStorage.setItem('pandas_dino_api_key', data.api_key);
            console.log('Saved pandas_dino_api_key in localStorage');
          } else {
            console.warn('Response did not contain api_key property');
          }
        } else {
          const errorText = await response.text();
          console.error(`Failed to check pandas dino user: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error('Error during POST to MAUI /checkpandinouser', error);
      }
    }
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
