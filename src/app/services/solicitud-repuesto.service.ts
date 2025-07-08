import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {Observable, of, tap, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SolicitudRepuestoInterface } from '../interfaces/solicitud-repuesto.interface';
import { RepuestoInterface } from '../interfaces/repuesto.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SolicitudRepuestoService {
  private apiUrl = `${environment.apiBaseUrl}/solicitudes-repuestos`;

  constructor(private http: HttpClient) {}

  registrarSolicitud(
    solicitud: SolicitudRepuestoInterface
  ): Observable<string> {
    return this.http
      .post(`${this.apiUrl}`, solicitud, {
        responseType: 'text', // Esto es importante para manejar respuestas de texto
      })
      .pipe(catchError(this.handleError));
  }

  listarRepuestos(): Observable<RepuestoInterface[]> {
    return this.http
      .get<RepuestoInterface[]>(`${this.apiUrl}/repuestos`)
      .pipe(catchError(this.handleError));
  }

  buscarRepuestos(nombre: string): Observable<RepuestoInterface[]> {
    return this.http
      .get<RepuestoInterface[]>(
        `${this.apiUrl}/repuestos/buscar?nombre=${nombre}`
      )
      .pipe(catchError(this.handleError));
  }

  listarSolicitudes(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  obtenerSolicitudes(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  actualizarEstado(id: number, estado: string): Observable<string> {
    return this.http
      .put<string>(`${this.apiUrl}/${id}/estado?estado=${estado}`, {})
      .pipe(catchError(this.handleError));
  }

  aprobarSolicitud(id: number, body: any = {}): Observable<string> {
    return this.http
      .put<string>(`${this.apiUrl}/${id}/estado?estado=ATENDIDO`, body)
      .pipe(catchError(this.handleError));
  }

  rechazarSolicitud(id: number, body: any = {}): Observable<string> {
    return this.http
      .put<string>(`${this.apiUrl}/${id}/estado?estado=RECHAZADO`, body)
      .pipe(catchError(this.handleError));
  }

  // Obtener solicitudes por técnico
  obtenerSolicitudesPorTecnico(idEmpleado: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tecnico/${idEmpleado}`)
      .pipe(
        tap(response => console.log('Respuesta del backend:', response)),
        catchError(this.handleError)
      );
  }

  // Editar solicitud por técnico
  editarSolicitudPorTecnico(idSolicitud: number, idEmpleadoTecnico: number, datos: any): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/editar/${idSolicitud}?idEmpleadoTecnico=${idEmpleadoTecnico}`, datos, {
        responseType: 'text' // AGREGAR ESTO - El backend devuelve texto plano
      })
      .pipe(
        catchError((error) => {
          // Si es status 200 pero Angular lo interpreta como error
          if (error.status === 200) {
            // Es exitoso, devolver el texto de respuesta
            return of(error.error.text || 'Solicitud actualizada correctamente');
          }
          return this.handleError(error);
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error completo:', error);

    let errorMessage = 'Ha ocurrido un error inesperado';

    // Si es status 200 pero Angular lo marca como error, es porque la respuesta es texto plano
    if (error.status === 200) {
      return throwError(() => ({
        status: 200,
        message: 'Operación exitosa',
        success: true,
      }));
    }

    if (error.error) {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error.error) {
        errorMessage = error.error.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => ({
      status: error.status || 500,
      message: errorMessage,
      success: false,
    }));
  }
}
