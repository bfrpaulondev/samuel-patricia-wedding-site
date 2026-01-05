const API_BASE_URL = import.meta.env.VITE_API_URL || 
  'https://samuel-patricia-wedding-api.vercel.app/api';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

interface LoginResponse {
  token: string;
  admin: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = localStorage.getItem('admin_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('admin_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('admin_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error: any) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Confirmações públicas
  async submitConfirmation(data: {
    fullName: string;
    email: string;
    phone?: string;
    willAttend: boolean;
    numberOfGuests?: number;
    dietaryRestrictions?: string;
    message?: string;
  }): Promise<any> {
    return this.request('/rsvps', {
      method: 'POST',
      body: JSON.stringify({
        name: data.fullName,
        email: data.email,
        guests: data.numberOfGuests || 1,
        dietary: data.dietaryRestrictions,
        message: data.message,
      }),
    });
  }

  async checkConfirmation(email: string): Promise<any> {
    return this.request(`/rsvps/check?email=${encodeURIComponent(email)}`);
  }

  // Admin - Autenticação
  async login(email: string, password: string): Promise<any> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // API retorna: { message, token, admin: { id, name, email, role } }
    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  logout() {
    this.clearToken();
  }

  // Admin - Confirmações
  async getConfirmations(params: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return this.request(`/admin/rsvps${query ? '?' + query : ''}`);
  }

  async updateConfirmationStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING'): Promise<any> {
    return this.request(`/admin/rsvps/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async approveConfirmation(id: string): Promise<any> {
    return this.updateConfirmationStatus(id, 'APPROVED');
  }

  async rejectConfirmation(id: string): Promise<any> {
    return this.updateConfirmationStatus(id, 'REJECTED');
  }

  async deleteConfirmation(id: string): Promise<any> {
    return this.request(`/admin/rsvps/${id}`, {
      method: 'DELETE',
    });
  }

  async getStats(): Promise<any> {
    return this.request('/admin/stats');
  }
}

export default new ApiService();
