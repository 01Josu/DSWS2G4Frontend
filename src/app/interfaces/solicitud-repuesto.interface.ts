export interface SolicitudRepuestoInterface {
  id?: number;
  codigoRepuesto: string;
  nombreRepuesto: string;
  cantidad: number;
  estado: 'PENDIENTE' | 'ATENDIDO' | 'RECHAZADO';
  fechaSolicitud?: string;
}
