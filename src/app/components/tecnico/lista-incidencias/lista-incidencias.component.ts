import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IncidenciaService } from '../../../services/incidencia.service';
import { IncidenciaInterface } from '../../../interfaces/incidencia.interface';

@Component({
  selector: 'app-lista-incidencias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lista-incidencias.component.html',
  styleUrl: './lista-incidencias.component.css'
})
export class ListaIncidenciasComponent implements OnInit {
  incidencias: IncidenciaInterface[] = [];
  numeroTicket: string = '';
  tecnicoId: number = 1; // ID fijo para pruebas
  cargando: boolean = false;
  error: string = '';

  constructor(
    private incidenciaService: IncidenciaService
  ) {}

  ngOnInit() {
    console.log('Inicializando componente ListaIncidenciasComponent');
    // Intentar obtener el ID del técnico desde localStorage
    try {
      const loginDataStr = localStorage.getItem('loginResponse');
      if (loginDataStr) {
        const loginData = JSON.parse(loginDataStr);
        if (loginData.idEmpleado) {
          this.tecnicoId = loginData.idEmpleado;
          console.log('ID de técnico obtenido:', this.tecnicoId);
        }
      }
    } catch (e) {
      console.error('Error al obtener ID de técnico:', e);
    }

    this.cargarIncidencias();
  }

  cargarIncidencias() {
    console.log('Cargando incidencias para técnico ID:', this.tecnicoId);
    this.cargando = true;
    this.error = '';

    this.incidenciaService.obtenerIncidenciasTecnico(this.tecnicoId)
      .subscribe({
        next: (data) => {
          console.log('Datos recibidos del servidor:', data);
          this.incidencias = data;
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar incidencias:', error);
          this.error = error.message || 'Error al cargar las incidencias.';
          this.cargando = false;
        }
      });
  }

  buscarPorTicket() {
    this.cargando = true;
    this.error = '';

    if (this.numeroTicket) {
      this.incidenciaService.obtenerIncidenciasTecnico(this.tecnicoId, this.numeroTicket)
        .subscribe({
          next: (data) => {
            this.incidencias = data;
            this.cargando = false;
          },
          error: (error) => {
            this.error = error.message || 'Error al buscar el ticket.';
            this.cargando = false;
          }
        });
    } else {
      this.cargarIncidencias();
    }
  }

  getEstadoClass(estado: string): string {
    switch(estado?.toLowerCase()) {
      case 'pendiente': return 'bg-warning';
      case 'en_proceso': return 'bg-info';
      case 'solucionado': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  getPrioridadClass(prioridad: number): string {
    if (prioridad >= 8) return 'bg-danger';
    if (prioridad >= 5) return 'bg-warning';
    return 'bg-info';
  }
}
