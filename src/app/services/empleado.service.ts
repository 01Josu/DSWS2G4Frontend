import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioSolicitante {
  id?: number;
  correoNumero: string;
  prioridadUsuario: number;
  equipo: {
    idEquipo: number;
    // puedes agregar más campos si los necesitas mostrar
  };
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = 'http://localhost:8080/api/usuarios-solicitantes';

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
