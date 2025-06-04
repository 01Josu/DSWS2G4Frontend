import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { IncidenciaInterface } from '../interfaces/incidencia.interface';
import { RegistroIncidenciaInterface } from '../interfaces/registro-incidencia.interface';
import { CategoriaInterface } from '../interfaces/categoria.interface';
import { SubcategoriaInterface } from '../interfaces/subcategoria.interface';
import { ProblemaInterface } from '../interfaces/problema.interface';
import { SolucionRequest } from '../interfaces/Solucion.Interface';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
  private apiUrl = 'http://localhost:8080/api/v1';
  private catalogosUrl = 'http://localhost:8080/api/catalogos';

  constructor(private http: HttpClient) {}

  obtenerCategorias(): Observable<CategoriaInterface[]> {
    return this.http.get<any[]>(`${this.catalogosUrl}/categorias`)
      .pipe(
        map(response => {
          return response.map(item => ({
            id: item.id || item.idCategoria || item.id_categoria,
            nombre: item.nombre || item.nombreCategoria || item.nombre_categoria
          }));
        }),
        catchError(this.handleError)
      );
  }

  obtenerSubcategorias(categoriaId: number): Observable<SubcategoriaInterface[]> {
    return this.http.get<any[]>(`${this.catalogosUrl}/subcategorias/${categoriaId}`)
      .pipe(
        map(response => {
          return response.map(item => ({
            id: item.id || item.idSubcategoria || item.id_subcategoria,
            nombre: item.nombre || item.nombreSubcategoria || item.nombre_subcategoria,
            categoriaId: item.categoriaId || item.idCategoria || categoriaId
          }));
        }),
        catchError(this.handleError)
      );
  }

  obtenerProblemas(subcategoriaId: number): Observable<ProblemaInterface[]> {
    return this.http.get<any[]>(`${this.catalogosUrl}/problemas/${subcategoriaId}`)
      .pipe(
        map(response => {
          return response.map(item => ({
            id: item.id || item.idProblema || item.id_problema,
            descripcion: item.descripcion || item.descripcionProblema || item.nombre,
            subcategoriaId: item.subcategoriaId || item.idSubcategoria || subcategoriaId
          }));
        }),
        catchError(this.handleError)
      );
  }

  registrarIncidenciaPublica(datos: RegistroIncidenciaInterface): Observable<any> {
    return this.http.post(`${this.apiUrl}/incidencias/publica`, datos)
      .pipe(catchError(this.handleError));
  }

  obtenerIncidenciasTecnico(tecnicoId: number, numeroTicket?: string): Observable<IncidenciaInterface[]> {
    let url = `${this.apiUrl}/tecnico/incidencias/${tecnicoId}`;

    if (numeroTicket) {
      url += `?numeroTicket=${numeroTicket}`;
    }

    console.log('URL para obtener incidencias:', url);

    const token = localStorage.getItem('token');

    // Verificar que el token existe
    if (!token) {
      console.error('No hay token de autenticación');
      return throwError(() => new Error('No está autenticado. Por favor, inicie sesión nuevamente.'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Añadir "Bearer " antes del token
    });

    console.log('Headers de autorización:', headers.get('Authorization'));

    // Mostrar información detallada para depuración
    return this.http.get<any>(url, { headers, observe: 'response' })
      .pipe(
        map(fullResponse => {
          console.log('Estado de la respuesta:', fullResponse.status);
          console.log('Headers de la respuesta:', fullResponse.headers);
          console.log('Cuerpo de la respuesta:', fullResponse.body);

          const response = fullResponse.body;

          // Manejar distintos formatos de respuesta
          if (Array.isArray(response)) {
            return response;
          } else if (response && typeof response === 'object') {
            // Buscar si hay una propiedad que contenga un array
            for (const key in response) {
              if (Array.isArray(response[key])) {
                return response[key];
              }
            }
          }
          return [];
        }),
        catchError(error => {
          console.error('Error detallado:', error);

          // Agregar información más detallada para depuración
          if (error.status === 0) {
            console.error('Error de conexión al servidor. Verifique que el backend esté en ejecución.');
          } else {
            console.error('Código de estado:', error.status);
            console.error('Mensaje de error:', error.error);
            console.error('Headers de respuesta:', error.headers);
          }

          return this.handleError(error);
        })
      );
  }

  getIncidenciasNoAsignadas(): Observable<IncidenciaInterface[]> {
    const url = `${this.apiUrl}/asignacion/no-asignadas`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<IncidenciaInterface[]>(url, { headers }).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error al obtener incidencias no asignadas:', error);

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


  asignarTecnico(idIncidencia: number, idTecnico: number): Observable<any> {
    const url = `http://localhost:8080/api/v1/asignacion`;
    const body = { idIncidencia, idTecnico };

    return this.http.post<string>(url, body, {
      responseType: 'text' as 'json'  // ✅ ACEPTA texto plano del backend
    }).pipe(
      catchError(error => {
        console.error('Error al asignar técnico:', error);

        if (error.status === 0) {
          console.error('Error de conexión al servidor.');
        } else {
          console.error('Código de estado:', error.status);
          console.error('Mensaje de error:', error.error); // aquí también será texto
        }

        return this.handleError(error);
      })
    );
  }

  
  // Obtener la incidencia
  getIncidenciaPorId(id: number): Observable<IncidenciaInterface> {
    return this.http.get<IncidenciaInterface>(`${this.apiUrl}/incidencias/publica/${id}`);
  }

  enviarAlerta(alerta: { idIncidencia: number; motivo: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/incidencias/alerta`, alerta)
      .pipe(catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse) {
    console.error('Error en la solicitud HTTP:', error);

    let errorMessage = 'Ha ocurrido un error en la comunicación con el servidor.';

    if (error.status === 0) {
      errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
    } else if (error.status === 401) {
      errorMessage = 'No está autorizado para realizar esta acción. Por favor, inicie sesión nuevamente.';
    } else if (error.status === 403) {
      errorMessage = 'No tiene permisos para acceder a este recurso.';
    } else if (error.status === 404) {
      errorMessage = 'El recurso solicitado no existe.';
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }

    return throwError(() => new Error(errorMessage));
  }

  actualizarIncidencia(incidencia: IncidenciaInterface): Observable<any> {
    const url = `${this.apiUrl}/incidencias/${incidencia.idIncidencia}`; // Ajusta la URL según tu backend
    return this.http.put(url, incidencia)
      .pipe(catchError(this.handleError));
  }
  
  // Obtener soluciones disponibles para una incidencia
  obtenerSolucionesPorId(idIncidencia: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/incidencias/${idIncidencia}/soluciones`);
  }

  // Registrar una solución aplicada a una incidencia
  registrarSolucion(request: SolucionRequest): Observable<any> {
    console.log('Request a enviar:', request);
    return this.http.post<any>(`${this.apiUrl}/incidencias/solucion`, request);
  }

}
