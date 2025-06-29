export interface IncidenciaInterface {
  idIncidencia?: number;
  id?: number;
  correoSolicitante: string;
  codigoEquipo: string;
  fechaRegistro: string;
  fecha: string;
  descripcionProblema: string;
  estado: string;
  prioridad: number;
  categoriaProblema: String;
  subCategoria:String;

  problemaSubcategoria: {
    descripcionProblema: string;
  },
  usuarioSolicitante: {
    correoNumero: string;
    equipo?: {
      codigoEquipo: string;
    };
  };
}

