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

  constructor(private incidenciaService: IncidenciaService) {}

  ngOnInit(): void {
    this.obtenerTodas();
  }

  // ✔ Cambiado a obtener todas las incidencias (no solo no asignadas)
  obtenerTodas(): void {
    this.incidenciaService.getTodasIncidencias().subscribe({
      next: data => this.incidencias = data,
      error: err => this.mensaje = err.message
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

  cancelarEdicion(): void {
    this.incidenciaEditando = null;
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
