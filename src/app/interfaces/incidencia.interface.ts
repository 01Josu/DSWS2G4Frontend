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
  categoriaProblema: string;
  subCategoria: string;

  problemaSubcategoria: {
    descripcionProblema: string;
  };

  usuarioSolicitante: {
    correoNumero: string;
    equipo?: {
      codigoEquipo: string;
    };
  };

  // Propiedades para asignacion
  asignacion?: {
    tecnico: {
      empleado: {
        username: string;
      };
    };
  } | null;
}
