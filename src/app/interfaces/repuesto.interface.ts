export interface RepuestoInterface {
  id?: number;  // opcional para nuevos registros
  codigoRepuesto: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
}