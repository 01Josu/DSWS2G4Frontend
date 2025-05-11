import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth'; // Endpoint base

  constructor(private http: HttpClient) {}

  // Método de login
  login(credentials: { username: string, password_hash: string }): Observable<any> {
    const body = {
      username: credentials.username,        // lo que espera tu backend
      password_hash: credentials.password_hash // lo que espera tu backend
    };
    return this.http.post(`${this.apiUrl}/login`, body);
  }

  // Método de registro
  register(data: { nombre: string, username: string, password_hash: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, data);
  }
  // Guardar el token JWT en el localStorage
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Obtener el token JWT del localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Cerrar sesión y eliminar el token
  logout(): void {
    localStorage.removeItem('authToken');
  }
}
