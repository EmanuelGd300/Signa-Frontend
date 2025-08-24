import { Marca, CreateMarcaRequest, UpdateMarcaRequest } from '@/types/marca';
import { API_BASE_URL } from './utils';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getMarcas(): Promise<Marca[]> {
    return this.request<Marca[]>('/marcas');
  }

  async getMarca(id: number): Promise<Marca> {
    return this.request<Marca>(`/marcas/${id}`);
  }

  async createMarca(marca: CreateMarcaRequest): Promise<Marca> {
    return this.request<Marca>('/marcas', {
      method: 'POST',
      body: JSON.stringify(marca),
    });
  }

  async updateMarca(id: number, marca: UpdateMarcaRequest): Promise<Marca> {
    return this.request<Marca>(`/marcas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(marca),
    });
  }

  async deleteMarca(id: number): Promise<void> {
    return this.request<void>(`/marcas/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();