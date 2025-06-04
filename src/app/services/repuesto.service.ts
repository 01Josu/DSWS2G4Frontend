import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepuestoInterface } from '../interfaces/repuesto.interface';

@Injectable({ providedIn: 'root' })
export class RepuestoService {
  private apiUrl = 'http://localhost:8080/api/v1/repuesto';

  constructor(private http: HttpClient) {}

  listarRepuestos(): Observable<RepuestoInterface[]> {
    return this.http.get<RepuestoInterface[]>(this.apiUrl);
  }

  obtenerRepuesto(id: number): Observable<RepuestoInterface> {
    return this.http.get<RepuestoInterface>(`${this.apiUrl}/${id}`);
  }

  crearRepuesto(repuesto: RepuestoInterface): Observable<RepuestoInterface> {
    return this.http.post<RepuestoInterface>(this.apiUrl, repuesto);
  }

  actualizarRepuesto(id: number, repuesto: RepuestoInterface): Observable<RepuestoInterface> {
    return this.http.put<RepuestoInterface>(`${this.apiUrl}/${id}`, repuesto);
  }

  eliminarRepuesto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
