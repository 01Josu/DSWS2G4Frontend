import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IncidenciaService } from '../../services/incidencia.service';
import { TecnicoService } from '../../services/tecnico.service';
import { IncidenciaInterface } from '../../interfaces/incidencia.interface';
import { TecnicoInterface } from '../../interfaces/tecnico.interface';
import { AuthService } from '../auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-asignar-incidencia',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './asignar-incidencia.component.html',
  styleUrls: ['./asignar-incidencia.component.css']
})
export class AsignarIncidenciaComponent implements OnInit {
  incidencias: IncidenciaInterface[] = [];
  tecnicos: TecnicoInterface[] = [];

  incidenciaSeleccionadaId: number | null = null;
  tecnicoSeleccionadoId: number | null = null;

  mensaje: string = '';

  constructor(
    private incidenciaService: IncidenciaService,
    private tecnicoService: TecnicoService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const loginResponse = localStorage.getItem('loginResponse');
    const usuario = loginResponse ? JSON.parse(loginResponse) : null;

    if (!usuario || usuario.rol !== 'JEFE_AREA') {
      this.router.navigate(['/acceso-denegado']); // o a una ruta segura
      return;
    }
    this.cargarIncidencias();
    this.cargarTecnicos();
  }

  cargarIncidencias(): void {
    this.incidenciaService.getIncidenciasNoAsignadas().subscribe({
      next: (data) => this.incidencias = data,
      error: (err) => console.error('Error al obtener incidencias', err)
    });
  }

  cargarTecnicos(): void {
    this.tecnicoService.getTecnicosDisponibles().subscribe({
      next: (data) => this.tecnicos = data,
      error: (err) => console.error('Error al obtener técnicos', err)
    });
  }

  asignarTecnico(): void {
    console.log('Incidencia seleccionada:', this.incidenciaSeleccionadaId);
    console.log('Técnico seleccionado:', this.tecnicoSeleccionadoId);
    if (this.incidenciaSeleccionadaId && this.tecnicoSeleccionadoId) {
      this.incidenciaService.asignarTecnico(
        this.incidenciaSeleccionadaId,
        this.tecnicoSeleccionadoId
      ).subscribe({
        next: () => {
          this.mensaje = 'Incidencia asignada correctamente.';
          this.incidenciaSeleccionadaId = null;
          this.tecnicoSeleccionadoId = null;
          this.cargarIncidencias(); // actualizar lista
        },
        error: () => {
          this.mensaje = 'Error al asignar técnico.';
        }
      });
    } else {
      this.mensaje = 'Debe seleccionar una incidencia y un técnico.';
    }
  }
}