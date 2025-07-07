import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IncidenciaService } from '../../services/incidencia.service';
import { CategoriaInterface } from '../../interfaces/categoria.interface';
import { SubcategoriaInterface } from '../../interfaces/subcategoria.interface';
import { ProblemaInterface } from '../../interfaces/problema.interface';
import {debounceTime, distinctUntilChanged} from 'rxjs';

@Component({
  selector: 'app-incidencia',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './incidencia.component.html',
  styleUrls: ['./incidencia.component.css']
})
export class IncidenciaComponent implements OnInit {
  incidenciaForm: FormGroup;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  // Para los selects anidados
  categorias: CategoriaInterface[] = [];
  subcategorias: SubcategoriaInterface[] = [];
  problemas: ProblemaInterface[] = [];

  // Para mostrar información del usuario encontrado
  usuarioEncontrado: any = null;
  buscandoUsuario: boolean = false;

  cargandoCategorias: boolean = false;
  cargandoSubcategorias: boolean = false;
  cargandoProblemas: boolean = false;

  constructor(
    private fb: FormBuilder,
    private incidenciaService: IncidenciaService
  ) {
    this.incidenciaForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      categoriaId: ['', Validators.required],
      subcategoriaId: ['', Validators.required],
      problemaId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarCategorias();

    // Escuchar cambios en el correo para autocompletar
    this.incidenciaForm.get('correo')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(correo => {
      if (correo && this.incidenciaForm.get('correo')?.valid) {
        this.buscarUsuario(correo);
      } else {
        this.usuarioEncontrado = null;
      }
    });

    // Escuchar cambios en categoría
    this.incidenciaForm.get('categoriaId')?.valueChanges.subscribe(categoriaId => {
      if (categoriaId) {
        this.cargarSubcategorias(categoriaId);
        this.incidenciaForm.get('subcategoriaId')?.setValue('');
        this.incidenciaForm.get('problemaId')?.setValue('');
      }
    });

    // Escuchar cambios en subcategoría
    this.incidenciaForm.get('subcategoriaId')?.valueChanges.subscribe(subcategoriaId => {
      if (subcategoriaId) {
        this.cargarProblemas(subcategoriaId);
        this.incidenciaForm.get('problemaId')?.setValue('');
      }
    });
  }

  buscarUsuario(correo: string): void {
    this.buscandoUsuario = true;
    this.incidenciaService.buscarUsuarioPorCorreo(correo).subscribe({
      next: (usuario) => {
        this.usuarioEncontrado = usuario;
        this.buscandoUsuario = false;
        if (!usuario) {
          this.mensajeError = 'Usuario no encontrado. Debe estar registrado en el sistema previamente.';
        } else {
          this.mensajeError = null;
        }
      },
      error: () => {
        this.usuarioEncontrado = null;
        this.buscandoUsuario = false;
        this.mensajeError = 'Usuario no encontrado. Debe estar registrado en el sistema previamente.';
      }
    });
  }

  cargarCategorias(): void {
    this.cargandoCategorias = true;
    this.incidenciaService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.cargandoCategorias = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.cargandoCategorias = false;
      }
    });
  }

  cargarSubcategorias(categoriaId: number): void {
    this.cargandoSubcategorias = true;
    this.incidenciaService.obtenerSubcategorias(categoriaId).subscribe({
      next: (subcategorias) => {
        this.subcategorias = subcategorias;
        this.cargandoSubcategorias = false;
      },
      error: (error) => {
        console.error('Error al cargar subcategorías:', error);
        this.cargandoSubcategorias = false;
      }
    });
  }

  cargarProblemas(subcategoriaId: number): void {
    this.cargandoProblemas = true;
    this.incidenciaService.obtenerProblemas(subcategoriaId).subscribe({
      next: (problemas) => {
        this.problemas = problemas;
        this.cargandoProblemas = false;
      },
      error: (error) => {
        console.error('Error al cargar problemas:', error);
        this.cargandoProblemas = false;
      }
    });
  }

  registrarIncidencia(): void {
    if (this.incidenciaForm.valid && this.usuarioEncontrado) {
      const datos = {
        correo: this.incidenciaForm.value.correo,
        categoriaId: this.incidenciaForm.value.categoriaId,
        subcategoriaId: this.incidenciaForm.value.subcategoriaId,
        problemaId: this.incidenciaForm.value.problemaId
      };

      this.incidenciaService.registrarIncidenciaPublica(datos).subscribe({
        next: (response: any) => {
          this.mensajeExito = `Incidencia registrada exitosamente. ID: ${response.idIncidencia}`;
          this.mensajeError = null;
          this.incidenciaForm.reset();
          this.usuarioEncontrado = null;

          // Resetear los valores por defecto
          setTimeout(() => {
            this.incidenciaForm.get('categoriaId')?.setValue('');
            this.incidenciaForm.get('subcategoriaId')?.setValue('');
            this.incidenciaForm.get('problemaId')?.setValue('');
          }, 100);
        },
        error: (error: any) => {
          this.mensajeError = error.error?.message || 'Error al registrar la incidencia. Por favor, inténtelo nuevamente.';
          this.mensajeExito = null;
          console.error('Error al registrar', error);
        }
      });
    } else {
      this.mensajeError = 'Por favor complete todos los campos y asegúrese de que el usuario esté registrado.';
    }
  }
}
