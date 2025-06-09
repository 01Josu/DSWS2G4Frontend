import { DetalleSolicitudInterface } from './detalle-solicitud.interface';

export interface SolicitudRepuestoInterface {
  idIncidencia: number;
  idTecnico: number;
  detalles: DetalleSolicitudInterface[];
}
