import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { TecnicoInterface } from '../interfaces/tecnico.interface';

@Injectable({
  providedIn: 'root'
})
export class TecnicoService {
  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  getTecnicosDisponibles(): Observable<TecnicoInterface[]> {
    const url = `http://localhost:8080/api/v1/asignacion/tecnicos-disponibles`;

    return this.http.get<any>(url).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response;
        }

        for (const key in response) {
          if (Array.isArray(response[key])) {
            return response[key];
          }
        }

        return [];
      }),
      catchError(error => {
        console.error('Error al obtener técnicos disponibles:', error);

        if (error.status === 0) {
          console.error('Error de conexión al servidor.');
        } else {
          console.error('Código de estado:', error.status);
          console.error('Mensaje de error:', error.error);
        }

        return this.handleError(error);
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la solicitud HTTP:', error);

    let errorMessage = 'Ha ocurrido un error en la comunicación con el servidor.';

    if (error.status === 0) {
      errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
    } else if (error.status === 401) {
      errorMessage = 'No está autorizado para realizar esta acción.';
    } else if (error.status === 403) {
      errorMessage = 'No tiene permisos para acceder a este recurso.';
    } else if (error.status === 404) {
      errorMessage = 'El recurso solicitado no existe.';
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
