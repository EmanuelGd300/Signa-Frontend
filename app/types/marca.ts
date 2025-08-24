export interface Marca {
  id?: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  fechaRegistro: string;
  estado: 'Activo' | 'Inactivo' | 'Pendiente';
  propietario: string;
  numeroRegistro?: string;
}

export interface CreateMarcaRequest {
  nombre: string;
  descripcion: string;
  categoria: string;
  propietario: string;
}

export interface UpdateMarcaRequest extends CreateMarcaRequest {
  estado: 'Activo' | 'Inactivo' | 'Pendiente';
}