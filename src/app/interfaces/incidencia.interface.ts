export interface IncidenciaInterface {
  id: number;
  correoSolicitante: string;
  codigoEquipo: string;
  fechaRegistro: string;
  descripcionProblema: string;
  estado: string;
  prioridad: number;
  problemaSubcategoria: {
    descripcionProblema: string;
  };
  usuarioSolicitante: {
    correoNumero: string;
  };
}

