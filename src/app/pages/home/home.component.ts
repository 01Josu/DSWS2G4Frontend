import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { IncidenciaService } from '../../services/incidencia.service';
import { IncidenciaInterface } from '../../interfaces/incidencia.interface';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Variables para búsqueda por ID
  codigoBusqueda: number | null = null;
  incidenciaEncontrada: IncidenciaInterface | null = null;
  mensajeBusqueda: string = '';

  // Variables para el modal de edición
  incidenciaSeleccionada: IncidenciaInterface | null = null;
  categorias: any[] = [];
  subcategorias: any[] = [];
  problemas: any[] = [];
  categoriaSeleccionada: number = 0;
  subcategoriaSeleccionada: number = 0;
  problemaSeleccionado: number = 0;
  mensajeModal: string = '';
  errorModal: string = '';

  constructor(private incidenciaService: IncidenciaService) {}

  buscarIncidencia(): void {
    this.mensajeBusqueda = '';
    this.incidenciaEncontrada = null;

    if (!this.codigoBusqueda) {
      this.mensajeBusqueda = 'Por favor, ingrese un ID de incidencia';
      return;
    }

    this.incidenciaService.getIncidenciaPorId(this.codigoBusqueda).subscribe({
      next: (data) => {
        this.incidenciaEncontrada = data;
        this.mensajeBusqueda = '';
      },
      error: (err) => {
        this.mensajeBusqueda = 'Incidencia no encontrada';
        this.incidenciaEncontrada = null;
      }
    });
  }

  limpiarResultados(): void {
    this.codigoBusqueda = null;
    this.incidenciaEncontrada = null;
    this.mensajeBusqueda = '';
  }

  // Verificar si la incidencia puede editarse (no asignada y pendiente)
  puedeEditarse(incidencia: IncidenciaInterface): boolean {
    return (incidencia.estado === 'pendiente' || incidencia.estado === 'PENDIENTE') &&
      !incidencia.asignacion;
  }

  // Método para enviar alerta
  enviarAlerta(): void {
    if (!this.incidenciaEncontrada?.idIncidencia) {
      console.warn('No se encontró idIncidencia');
      return;
    }

    const alerta = {
      idIncidencia: this.incidenciaEncontrada.idIncidencia,
      motivo: 'Tiempo de atención excedido'
    };

    this.incidenciaService.enviarAlerta(alerta).subscribe({
      next: (res) => {
        this.mensajeBusqueda = res.mensaje || 'Alerta enviada correctamente';
      },
      error: (err) => {
        console.error('Error al enviar alerta:', err);
        this.mensajeBusqueda = 'No se pudo enviar la alerta.';
      }
    });
  }

  // Abrir modal de edición
  abrirModalEdicion(incidencia: IncidenciaInterface): void {
    this.incidenciaSeleccionada = incidencia;
    this.mensajeModal = '';
    this.errorModal = '';
    this.cargarCategorias();

    const modal = new bootstrap.Modal(document.getElementById('modalEditarIncidencia'));
    modal.show();
  }

  cargarCategorias(): void {
    this.incidenciaService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      }
    });
  }

  onCategoriaChange(): void {
    if (this.categoriaSeleccionada) {
      this.incidenciaService.obtenerSubcategorias(this.categoriaSeleccionada).subscribe({
        next: (data) => {
          this.subcategorias = data;
          this.subcategoriaSeleccionada = 0;
          this.problemas = [];
          this.problemaSeleccionado = 0;
        }
      });
    }
  }

  onSubcategoriaChange(): void {
    if (this.subcategoriaSeleccionada) {
      this.incidenciaService.obtenerProblemas(this.subcategoriaSeleccionada).subscribe({
        next: (data) => {
          this.problemas = data;
          this.problemaSeleccionado = 0;
        }
      });
    }
  }

  guardarCambios(): void {
    if (!this.problemaSeleccionado) {
      this.errorModal = 'Debe seleccionar un problema';
      return;
    }

    const datosActualizados = {
      problemaId: this.problemaSeleccionado
    };

    if (this.incidenciaSeleccionada?.correoSolicitante) {
      this.incidenciaService.editarIncidenciaPublica(
        this.incidenciaSeleccionada.idIncidencia || this.incidenciaSeleccionada.id || 0,
        this.incidenciaSeleccionada.correoSolicitante,
        datosActualizados
      ).subscribe({
        next: (response) => {
          this.mensajeModal = 'Incidencia actualizada correctamente';
          this.errorModal = '';
          this.cerrarModal();
          // Recargar la incidencia para mostrar los cambios
          if (this.codigoBusqueda) {
            this.buscarIncidencia();
          }
        },
        error: (error) => {
          this.errorModal = 'Error al actualizar la incidencia';
        }
      });
    }
  }

  cerrarModal(): void {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarIncidencia'));
    if (modal) {
      modal.hide();
    }
    this.incidenciaSeleccionada = null;
    this.categoriaSeleccionada = 0;
    this.subcategoriaSeleccionada = 0;
    this.problemaSeleccionado = 0;
  }
}
