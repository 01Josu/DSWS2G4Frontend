import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SolicitudRepuestoInterface } from '../interfaces/solicitud-repuesto.interface';

@Injectable({
  providedIn: 'root'
})
export class SolicitudRepuestoService {
  private apiUrl = 'http://localhost:8080/api/v1/solicitudes-repuestos';

  constructor(private http: HttpClient) {}

  listarSolicitudes(): Observable<SolicitudRepuestoInterface[]> {
    return this.http.get<SolicitudRepuestoInterface[]>(this.apiUrl);
  }

  aprobarSolicitud(id: number): Observable<SolicitudRepuestoInterface> {
    return this.http.put<SolicitudRepuestoInterface>(`${this.apiUrl}/${id}`, { nuevoEstado: 'ATENDIDO' });
  }

  rechazarSolicitud(id: number): Observable<SolicitudRepuestoInterface> {
    return this.http.put<SolicitudRepuestoInterface>(`${this.apiUrl}/${id}`, { nuevoEstado: 'RECHAZADO' });
  }
}
