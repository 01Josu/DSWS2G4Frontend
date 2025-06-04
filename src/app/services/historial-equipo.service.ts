import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HistorialEquipoDTO {
  id: number;
  codigoEquipo: string;
  descripcionProblema: string;
  nombreCategoria: string;
  nombreSubcategoria: string;
  solucionProblema: string;
  palabrasClave: string;
  fechaSolucion: string; 
}

@Injectable({
  providedIn: 'root'
})
export class HistorialEquipoService {
  private baseUrl = 'http://localhost:8080/api/historial';

  constructor(private http: HttpClient) {}

  // 1. GET /todos
  obtenerTodo(): Observable<HistorialEquipoDTO[]> {
    return this.http.get<HistorialEquipoDTO[]>(`${this.baseUrl}/todos`);
  }

  // 2. POST /buscar-por-codigo
  buscarPorCodigo(codigo: string): Observable<HistorialEquipoDTO[]> {
    return this.http.post<HistorialEquipoDTO[]>(`${this.baseUrl}/buscar-por-codigo`, {
      codigo: codigo
    });
  }

  // 3. POST /buscar (por palabra clave)
  buscarPorPalabraClave(palabra: string): Observable<HistorialEquipoDTO[]> {
    return this.http.post<HistorialEquipoDTO[]>(`${this.baseUrl}/buscar`, {
      palabra: palabra
    });
  }
}
