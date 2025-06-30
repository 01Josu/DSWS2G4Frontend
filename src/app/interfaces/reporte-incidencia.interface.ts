export interface ReporteIncidenciaInterface {
  idIncidencia: number;
  correoSolicitante: string;
  codigoEquipo: string;
  problema: string;
  estado: string;
  modalidadAtencion: string;
  fechaRegistro: string;
  tecnicoAsignado?: string;
  prioridad: number;
  categoria: string;
  subcategoria: string;
}
