import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidenciaService } from '../../services/incidencia.service';
import { IncidenciaInterface } from '../../interfaces/incidencia.interface';

@Component({
  selector: 'app-gestionar-incidencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionar-incidencias.component.html',
  styleUrls: ['./gestionar-incidencias.component.css']
})
export class GestionarIncidenciasComponent implements OnInit {
  incidencias: IncidenciaInterface[] = [];
  incidenciaEditando: IncidenciaInterface | null = null;
  mensaje: string = '';

  // Paginación
  paginaActual: number = 1;
  elementosPorPagina: number = 10;

  // Carga
  cargando: boolean = true;

  constructor(private incidenciaService: IncidenciaService) {}

  ngOnInit(): void {
    this.obtenerTodas();
  }

  get incidenciasPaginadas(): IncidenciaInterface[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    return this.incidencias.slice(inicio, inicio + this.elementosPorPagina);
  }

  obtenerTodas(): void {
    this.cargando = true;
    this.incidenciaService.getTodasIncidencias().subscribe({
      next: data => {
        this.incidencias = data;
        this.cargando = false;
      },
      error: err => {
        this.mensaje = err.message;
        this.cargando = false;
      }
    });
  }

  editar(inc: IncidenciaInterface): void {
    this.incidenciaEditando = { ...inc };
  }

  guardarCambios(): void {
    if (this.incidenciaEditando) {
      this.incidenciaService.actualizarIncidencia(this.incidenciaEditando).subscribe({
        next: () => {
          this.incidenciaEditando = null;
          this.obtenerTodas();
        },
        error: err => alert(err.message)
      });
    }
  }

  eliminar(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta incidencia?')) {
      this.incidenciaService.eliminarIncidencia(id).subscribe({
        next: () => this.obtenerTodas(),
        error: err => alert(err.message)
      });
    }
  }
}
