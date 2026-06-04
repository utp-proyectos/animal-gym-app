export interface Membership {
  id: number;
  nombre: string;
  descripcion: string;
  duracionDias: number;
  precio: number;
  estado: 'Activo' | 'Inactivo';
  imagenUrl: string;
  fechaCreacion?: string;
}

export type MembershipFormData = Omit<Membership, 'id' | 'fechaCreacion'>;