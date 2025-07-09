import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { IncidenciaInterface } from '../interfaces/incidencia.interface';
import { RegistroIncidenciaInterface } from '../interfaces/registro-incidencia.interface';
import { CategoriaInterface } from '../interfaces/categoria.interface';
import { SubcategoriaInterface } from '../interfaces/subcategoria.interface';
import { ProblemaInterface } from '../interfaces/problema.interface';
import { SolucionRequest } from '../interfaces/Solucion.Interface';
import {ReporteIncidenciaInterface} from '../interfaces/reporte-incidencia.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
  private apiUrl = environment.apiBaseUrl;
  private catalogosUrl = `${environment.apiBaseUrl}/catalogos`;

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
    let params = new HttpParams();

    if (numeroTicket) {
      params = params.set('numeroTicket', numeroTicket);
    }

    console.log('URL para obtener incidencias:', url);

    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No hay token de autenticación');
      return throwError(() => new Error('No está autenticado. Por favor, inicie sesión nuevamente.'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log('Headers de autorización:', headers.get('Authorization'));

    return this.http.get<any>(url, { headers, params, observe: 'response' })
      .pipe(
        map(fullResponse => {
          console.log('Estado de la respuesta:', fullResponse.status);
          console.log('Headers de la respuesta:', fullResponse.headers);
          console.log('Cuerpo de la respuesta:', fullResponse.body);

          const response = fullResponse.body;

          if (Array.isArray(response)) {
            return response;
          } else if (response && typeof response === 'object') {
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
    const url = `${environment.apiBaseUrl}/asignacion`;
    const body = { idIncidencia, idTecnico };

    return this.http.post<string>(url, body, {
      responseType: 'text' as 'json'
    }).pipe(
      catchError(error => {
        console.error('Error al asignar técnico:', error);

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

  getIncidenciaPorId(id: number): Observable<IncidenciaInterface> {
    return this.http.get<IncidenciaInterface>(`${this.apiUrl}/incidencias/publica/${id}`);
  }

  enviarAlerta(alerta: { idIncidencia: number; motivo: string }): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };

    return this.http.post(`${this.apiUrl}/incidencias/alerta`, alerta, { headers })
      .pipe(catchError(this.handleError));
  }

  generarReporteIncidencias(fechaInicio?: string, fechaFin?: string): Observable<ReporteIncidenciaInterface[]> {
    let params = new HttpParams();
    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }
    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }

    return this.http.get<ReporteIncidenciaInterface[]>(`${this.apiUrl}/incidencias/reporte`, { params })
      .pipe(catchError(this.handleError));
  }

  buscarIncidenciasPorCorreo(correo: string): Observable<IncidenciaInterface[]> {
    // AGREGAR LOGS PARA DEBUG
    console.log('Servicio - Buscando correo:', correo);
    const url = `${this.apiUrl}/incidencias/seguimiento?correo=${encodeURIComponent(correo)}`;
    console.log('URL generada:', url);

    return this.http.get<any[]>(url)
      .pipe(
        map(response => {
          console.log('Respuesta cruda del backend:', response);

          if (!Array.isArray(response)) {
            console.warn('La respuesta no es un array:', response);
            return [];
          }

          return response.map((item: any) => ({
            idIncidencia: item.idIncidencia,
            id: item.idIncidencia,
            correoSolicitante: correo,
            estado: item.estado,
            fechaRegistro: item.fechaRegistro,
            fecha: item.fechaRegistro,
            descripcionProblema: item.problema,
            prioridad: item.prioridad || 1,
            codigoEquipo: item.codigoEquipo || '',
            categoriaProblema: item.categoria || '',
            subCategoria: item.subcategoria || '',
            usuarioSolicitante: {
              correoNumero: correo
            },
            problemaSubcategoria: {
              descripcionProblema: item.problema
            },
            asignacion: item.tecnicoAsignado ? {
              tecnico: {
                empleado: {
                  username: item.tecnicoAsignado
                }
              }
            } : null
          }));
        }),
        catchError(error => {
          console.error('Error en el servicio:', error);
          return this.handleError(error);
        })
      );
  }

  editarIncidenciaPublica(idIncidencia: number, correo: string, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/incidencias/editar-publica/${idIncidencia}?correo=${correo}`, datos)
      .pipe(catchError(this.handleError));
  }

  // NUEVOS MÉTODOS FALTANTES
  actualizarIncidencia(incidencia: IncidenciaInterface): Observable<any> {
    const url = `${this.apiUrl}/incidencias/${incidencia.idIncidencia}`;
    return this.http.put(url, incidencia)
      .pipe(catchError(this.handleError));
  }

  obtenerSolucionesPorId(idIncidencia: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/incidencias/${idIncidencia}/soluciones`)
      .pipe(catchError(this.handleError));
  }

  registrarSolucion(request: SolucionRequest): Observable<any> {
    console.log('Request a enviar:', request);
    return this.http.post<any>(`${this.apiUrl}/incidencias/solucion`, request)
      .pipe(catchError(this.handleError));
  }

  getTodasIncidencias(): Observable<IncidenciaInterface[]> {
    return this.http.get<IncidenciaInterface[]>(`${this.apiUrl}/incidencias`)
      .pipe(catchError(this.handleError));
  }

  eliminarIncidencia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/incidencias/${id}`)
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

  buscarUsuarioPorCorreo(correo: string): Observable<any> {
    const url = `${this.apiUrl}/usuarios-solicitantes/buscar-por-correo?correo=${encodeURIComponent(correo)}`;
    return this.http.get<any>(url);
  }
}
