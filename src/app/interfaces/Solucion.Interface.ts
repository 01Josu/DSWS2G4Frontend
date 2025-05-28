export interface SolucionRequest {
  idIncidencia: number;
  idSolucion: number;
  palabrasClave: string;
  modalidadAtencion: string; // "remoto" | "taller"
  estado: string;            // "solucionado", etc.
}
