import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient) { }

  login(loginData: any): Observable<any> {
    console.log('Enviando solicitud de login:', loginData);
    return this.http.post<any>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          console.log('Respuesta login:', response);
          if (response.token) {
            this.saveToken(response.token);
            localStorage.setItem('loginResponse', JSON.stringify(response));
          }
        }),
        catchError(this.handleError)
      );
  }

  register(registroData: any): Observable<any> {
    console.log('Enviando solicitud de registro:', registroData);
    return this.http.post<any>(`${this.apiUrl}/auth/registro`, registroData)
      .pipe(
        catchError(this.handleError)
      );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('loginResponse');
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la solicitud HTTP:', error);

    let errorMessage = 'Ha ocurrido un error en la comunicación con el servidor.';

    if (error.status === 0) {
      errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
    } else if (error.status === 401) {
      errorMessage = 'Credenciales incorrectas. Por favor, verifique usuario y contraseña.';
    } else if (error.status === 403) {
      errorMessage = 'Acceso denegado. No tiene permisos para acceder.';
    } else if (error.status === 404) {
      errorMessage = 'El servicio de autenticación no está disponible.';
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
