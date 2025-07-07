import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  getTicketsPorTecnico(): Observable<TicketsPorTecnico[]> {
    return this.http.get<TicketsPorTecnico[]>(`${this.apiUrl}/estadisticas/tickets-tecnico`);
  }

  getProblemasFrecuentes() {
    return this.http.get<ProblemasFrecuentes[]>(`${this.apiUrl}/estadisticas/problemas-frecuentes`);
  }
}
