import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IncidenciaService } from '../services/incidencia.service';

@Component({
  selector: 'app-detalle-incidencia-publica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-incidencia-publica.component.html',
  styleUrls: ['./detalle-incidencia-publica.component.css']
})
export class DetalleIncidenciaPublicaComponent implements OnInit {
  idIncidencia: number = 0;
  incidencia: any = null;
  error: string = '';
  mensaje: string = '';

  // Variables para edición
  modoEdicion: boolean = false;
  correoSolicitante: string = '';
  categoriaSeleccionada: number = 0;
  subcategoriaSeleccionada: number = 0;
  problemaSeleccionado: number = 0;

  categorias: any[] = [];
  subcategorias: any[] = [];
  problemas: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private incidenciaService: IncidenciaService
  ) {}

  ngOnInit(): void {
    this.idIncidencia = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idIncidencia) {
      this.cargarIncidencia();
    }
  }

  cargarIncidencia(): void {
    this.incidenciaService.getIncidenciaPorId(this.idIncidencia).subscribe({
      next: (data) => {
        this.incidencia = data;
        this.error = '';
      },
      error: (error) => {
        this.error = 'No se pudo cargar la incidencia';
        console.error(error);
      }
    });
  }

  habilitarEdicion(): void {
    if (!this.correoSolicitante) {
      this.error = 'Debe ingresar su correo electrónico para editar la incidencia';
      return;
    }

    if (this.incidencia && this.correoSolicitante !== this.incidencia.usuarioSolicitante?.correoNumero) {
      this.error = 'El correo ingresado no coincide con el solicitante de la incidencia';
      return;
    }

    this.modoEdicion = true;
    this.error = '';
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.incidenciaService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
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
      this.error = 'Debe seleccionar un problema';
      return;
    }

    const datosActualizados = {
      problemaId: this.problemaSeleccionado
    };

    this.incidenciaService.editarIncidenciaPublica(this.idIncidencia, this.correoSolicitante, datosActualizados).subscribe({
      next: (response) => {
        this.mensaje = 'Incidencia actualizada correctamente';
        this.error = '';
        this.modoEdicion = false;
        this.cargarIncidencia();
      },
      error: (error) => {
        console.error('Error al actualizar:', error);
        if (error.error && error.error.mensaje) {
          this.error = error.error.mensaje;
        } else {
          this.error = 'Error al actualizar la incidencia';
        }
      }
    });
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.correoSolicitante = '';
    this.categoriaSeleccionada = 0;
    this.subcategoriaSeleccionada = 0;
    this.problemaSeleccionado = 0;
    this.error = '';
    this.mensaje = '';
  }
}
