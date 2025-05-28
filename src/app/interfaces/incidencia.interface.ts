export interface IncidenciaInterface {
  idIncidencia?: number;
  id?: number;
  correoSolicitante: string;
  codigoEquipo: string;
  fechaRegistro: string;
  descripcionProblema: string;
  estado: string;
  prioridad: number;
  categoriaProblema: String;
  subCategoria:String;

  problemaSubcategoria: {
    "descripcionProblema": "Pantalla no enciende"
  },
  usuarioSolicitante: {
    "correoNumero": "usuario@email.com"
  },
}

