import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UsuarioSolicitante {
  id?: number;
  correoNumero: string;
  equipo?: {
    idEquipo?: number;
    codigoEquipo?: string;
  };
  datosEmpleado: {
    nombre: string;
    apellido: string;
    dni: string;
    celular?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiBaseUrl}/usuarios-solicitantes`;

  constructor(private http: HttpClient) {}

  listar(): Observable<UsuarioSolicitante[]> {
    return this.http.get<UsuarioSolicitante[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<UsuarioSolicitante> {
    return this.http.get<UsuarioSolicitante>(`${this.apiUrl}/${id}`);
  }

  crear(usuario: UsuarioSolicitante): Observable<UsuarioSolicitante> {
    return this.http.post<UsuarioSolicitante>(this.apiUrl, usuario);
  }

  actualizar(id: number, usuario: UsuarioSolicitante): Observable<UsuarioSolicitante> {
    return this.http.put<UsuarioSolicitante>(`${this.apiUrl}/${id}`, usuario);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
