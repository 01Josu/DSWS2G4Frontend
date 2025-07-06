import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TicketsPorTecnico {
  tecnico: string;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = 'http://TU_BACKEND/tickets-por-tecnico'; // Cambia la URL por la de tu API

  constructor(private http: HttpClient) {}

  getTicketsPorTecnico(): Observable<TicketsPorTecnico[]> {
    return this.http.get<TicketsPorTecnico[]>(this.apiUrl);
  }
}
