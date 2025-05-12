import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IncidenciaService } from '../../services/incidencia.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-incidencia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h2>Registro de Incidencia</h2>
      <form [formGroup]="incidenciaForm" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label class="form-label">Correo electrónico</label>
          <input type="email" class="form-control" formControlName="correo">
        </div>
        <div class="mb-3">
          <label class="form-label">Código de Equipo</label>
          <input type="text" class="form-control" formControlName="codigoEquipo">
        </div>
        <div class="mb-3">
          <label class="form-label">Problema</label>
          <select class="form-select" formControlName="problemaId">
            <option value="">Seleccione un problema</option>
            <!-- Aquí irían las opciones de problemas -->
          </select>
        </div>
        <button type="submit" class="btn btn-primary" [disabled]="!incidenciaForm.valid">
          Registrar Incidencia
        </button>
      </form>
    </div>
  `
})
export class RegistroIncidenciaComponent {
  incidenciaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private incidenciaService: IncidenciaService
  ) {
    this.incidenciaForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      codigoEquipo: ['', Validators.required],
      problemaId: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.incidenciaForm.valid) {
      this.incidenciaService.registrarIncidenciaPublica(this.incidenciaForm.value)
        .subscribe({
          next: (response) => {
            alert(`Incidencia registrada exitosamente. ID: ${response.idIncidencia}`);
            this.incidenciaForm.reset();
          },
          error: (error) => {
            alert('Error al registrar la incidencia');
          }
        });
    }
  }
}
