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
    this.storeUserEmail(authResponse.user.email);
    const tokenCount = await this.authenticateMAUI(authResponse.user.email);
    // Dispatch event to update UI regardless of token count
    document.dispatchEvent(new CustomEvent('tokenCountUpdate', { detail: tokenCount }));
    return authResponse;
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

  private async authenticateMAUI(userEmail: string): Promise<number> {
    const mauiBaseUrl = import.meta.env.VITE_MAUI_API_URL;
    if (!mauiBaseUrl) {
      console.error('VITE_MAUI_API_URL is not set');
      return 0;
    }

    const apiKey = localStorage.getItem('pandas_dino_api_key');
    if (apiKey) {
      try {
        const response = await fetch(`${mauiBaseUrl}/getusertokens`, {
          method: 'POST',
          headers: {
            'X-USER-EMAIL': userEmail,
            'X-API-KEY': apiKey
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Response from /getusertokens in authenticateMAUI:', data);
          // Check if tokens count is in response body
          if (typeof data.tokens === 'number') {
            return data.tokens;
          }
          // Check if tokens are nested under response property
          if (data.response && typeof data.response.tokens === 'number') {
            return data.response.tokens;
          }
        } else {
          const errorText = await response.text();
          console.error(`Failed to get user token from MAUI: ${response.status} - ${errorText}`);
        }
        return 0;
      } catch (error) {
        console.error('Error during POST to MAUI /getusertokens', error);
        return 0;
      }
    } else {
      // POST call to /checkpandinouser
      const token = this.getStoredToken();
      if (!token) {
        console.error('No auth token available');
        return 0;
      }

      const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT;
      if (!graphqlEndpoint) {
        console.error('VITE_GRAPHQL_ENDPOINT is not set');
        return 0;
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
          if (data.response?.user?.api_key) {
            const apiKey = data.response.user.api_key;
            localStorage.setItem('pandas_dino_api_key', apiKey);
            console.log('Saved pandas_dino_api_key in localStorage');
            
            // After saving key, fetch token count
            const newApiKey = localStorage.getItem('pandas_dino_api_key');
            if (newApiKey) {
              return this.authenticateMAUI(userEmail);
            }
          } else {
            console.warn('Response did not contain the expected api_key property');
          }
        } else {
          const errorText = await response.text();
          console.error(`Failed to check pandas dino user: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error('Error during POST to MAUI /checkpandinouser', error);
      }
      return 0;
    }
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

  async getTokenCount(userEmail: string): Promise<number> {
    const mauiBaseUrl = import.meta.env.VITE_MAUI_API_URL;
    if (!mauiBaseUrl) {
      console.error('VITE_MAUI_API_URL is not set');
      return 0;
    }

    const apiKey = localStorage.getItem('pandas_dino_api_key');
    if (!apiKey) {
      return 0;
    }

    try {
      const response = await fetch(`${mauiBaseUrl}/getusertokens`, {
        method: 'POST',
        headers: {
          'X-USER-EMAIL': userEmail,
          'X-API-KEY': apiKey
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response from /getusertokens in getTokenCount:', data);
        // Check if tokens count is in response body
        if (typeof data.tokens === 'number') {
          return data.tokens;
        }
        // Check if tokens are nested under response property
        if (data.response && typeof data.response.tokens === 'number') {
          return data.response.tokens;
        }
      } else {
        const errorText = await response.text();
        console.error(`Failed to get token count: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error getting token count', error);
    }
    return 0;
  }

  storeToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  storeUserEmail(email: string): void {
    localStorage.setItem('auth_user_email', email);
  }

  getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
  }
}
