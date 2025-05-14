import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { IncidenciaService } from '../../services/incidencia.service';
import { IncidenciaInterface } from '../../interfaces/incidencia.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  codigoBusqueda: number | null = null;
  incidenciaEncontrada: IncidenciaInterface | null = null;
  mensajeBusqueda: string = '';

  constructor(private incidenciaService: IncidenciaService) {}

  buscarIncidencia(): void {
    this.mensajeBusqueda = '';
    this.incidenciaEncontrada = null;

    if (!this.codigoBusqueda) {
      this.mensajeBusqueda = 'Ingrese un ID válido para buscar.';
      return;
    }

    this.incidenciaService.getIncidenciaPorId(this.codigoBusqueda).subscribe({
      next: (data) => this.incidenciaEncontrada = data,
      error: (err) => {
        console.error('Error al buscar incidencia:', err);
        this.mensajeBusqueda = 'No se encontró la incidencia o ocurrió un error.';
      }
    });
  }

  enviarAlerta(): void {
    if (!this.incidenciaEncontrada?.id) return;

    const alerta = {
      idIncidencia: this.incidenciaEncontrada.id,
      motivo: 'Tiempo de atención excedido'
    };

    this.incidenciaService.enviarAlerta(alerta).subscribe({
      next: () => {
        this.mensajeBusqueda = 'Alerta enviada correctamente.';
      },
      error: (err) => {
        console.error('Error al enviar alerta:', err);
        this.mensajeBusqueda = 'No se pudo enviar la alerta.';
      }
    });
  }


}
