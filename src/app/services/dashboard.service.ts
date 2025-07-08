import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TicketsPorTecnico {
  tecnico: string;
  total: number;
}

export interface ProblemasFrecuentes {
  nombreProblema: string;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = `${environment.apiBaseUrl}/estadisticas`;

  constructor(private http: HttpClient) {}

  getTicketsPorTecnico(): Observable<TicketsPorTecnico[]> {
    return this.http.get<TicketsPorTecnico[]>(`${this.apiUrl}/tickets-tecnico`);
  }

  getProblemasFrecuentes() {
    return this.http.get<ProblemasFrecuentes[]>(`${this.apiUrl}/problemas-frecuentes`);
  }
}
