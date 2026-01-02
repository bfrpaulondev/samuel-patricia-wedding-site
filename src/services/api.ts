const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

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
  ): Promise<ApiResponse<T>> {
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
    message?: string;
  }): Promise<ApiResponse> {
    return this.request('/confirmations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkConfirmation(email: string): Promise<ApiResponse> {
    return this.request(`/confirmations/check/${encodeURIComponent(email)}`);
  }

  // Admin - Autenticação
  async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
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
  } = {}): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    return this.request(`/admin/confirmations?${queryParams.toString()}`);
  }

  async approveConfirmation(id: string): Promise<ApiResponse> {
    return this.request(`/admin/confirmations/${id}/approve`, {
      method: 'PATCH',
    });
  }

  async rejectConfirmation(id: string): Promise<ApiResponse> {
    return this.request(`/admin/confirmations/${id}/reject`, {
      method: 'PATCH',
    });
  }

  async deleteConfirmation(id: string): Promise<ApiResponse> {
    return this.request(`/admin/confirmations/${id}`, {
      method: 'DELETE',
    });
  }

  async getStats(): Promise<ApiResponse> {
    return this.request('/admin/stats');
  }
}

export default new ApiService();
