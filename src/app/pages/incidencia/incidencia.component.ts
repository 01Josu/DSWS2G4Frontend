import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IncidenciaService } from '../../services/incidencia.service';
import { CategoriaInterface } from '../../interfaces/categoria.interface';
import { SubcategoriaInterface } from '../../interfaces/subcategoria.interface';
import { ProblemaInterface } from '../../interfaces/problema.interface';

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

  cargandoCategorias: boolean = false;
  cargandoSubcategorias: boolean = false;
  cargandoProblemas: boolean = false;

  constructor(
    private fb: FormBuilder,
    private incidenciaService: IncidenciaService
  ) {
    this.incidenciaForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      codigoEquipo: ['', Validators.required],
      categoriaId: ['', Validators.required],
      subcategoriaId: ['', Validators.required],
      problemaId: ['', Validators.required]
    });

    // Escuchar cambios en categoría para cargar subcategorías
    this.incidenciaForm.get('categoriaId')?.valueChanges.subscribe(categoriaId => {
      if (categoriaId) {
        this.cargarSubcategorias(categoriaId);
        this.incidenciaForm.get('subcategoriaId')?.setValue('');
        this.incidenciaForm.get('problemaId')?.setValue('');
      }
    });

    // Escuchar cambios en subcategoría para cargar problemas
    this.incidenciaForm.get('subcategoriaId')?.valueChanges.subscribe(subcategoriaId => {
      if (subcategoriaId) {
        this.cargarProblemas(subcategoriaId);
        this.incidenciaForm.get('problemaId')?.setValue('');
      }
    });
  }

  ngOnInit(): void {
    // Cargar categorías al iniciar
    this.cargarCategorias();

    // Asegurarse de que los estilos de Bootstrap se apliquen correctamente
    document.body.classList.add('bg-light');
  }

  cargarCategorias(): void {
    this.cargandoCategorias = true;
    this.incidenciaService.obtenerCategorias().subscribe({
      next: (data: CategoriaInterface[]) => {
        this.categorias = data;
        this.cargandoCategorias = false;
      },
      error: (error: any) => {
        console.error('Error al cargar categorías', error);
        this.cargandoCategorias = false;
      }
    });
  }

  cargarSubcategorias(categoriaId: number): void {
    this.cargandoSubcategorias = true;
    this.incidenciaService.obtenerSubcategorias(categoriaId).subscribe({
      next: (data: SubcategoriaInterface[]) => {
        this.subcategorias = data;
        this.cargandoSubcategorias = false;
      },
      error: (error: any) => {
        console.error('Error al cargar subcategorías', error);
        this.cargandoSubcategorias = false;
      }
    });
  }

  cargarProblemas(subcategoriaId: number): void {
    this.cargandoProblemas = true;
    this.incidenciaService.obtenerProblemas(subcategoriaId).subscribe({
      next: (data: ProblemaInterface[]) => {
        this.problemas = data;
        this.cargandoProblemas = false;
      },
      error: (error: any) => {
        console.error('Error al cargar problemas', error);
        this.cargandoProblemas = false;
      }
    });
  }

  registrarIncidencia(): void {
    if (this.incidenciaForm.valid) {
      this.incidenciaService.registrarIncidenciaPublica(this.incidenciaForm.value)
        .subscribe({
          next: (response: any) => {
            this.mensajeExito = `Incidencia registrada exitosamente. ID: ${response.idIncidencia}`;
            this.mensajeError = null;
            this.incidenciaForm.reset();
            // Resetear los valores por defecto
            setTimeout(() => {
              this.incidenciaForm.get('categoriaId')?.setValue('');
              this.incidenciaForm.get('subcategoriaId')?.setValue('');
              this.incidenciaForm.get('problemaId')?.setValue('');
            }, 100);
          },
          error: (error: any) => {
            this.mensajeError = 'Error al registrar la incidencia. Por favor, inténtelo nuevamente.';
            this.mensajeExito = null;
            console.error('Error al registrar', error);
          }
        });
    }
  }
}
