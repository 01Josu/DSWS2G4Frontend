import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HistorialEquipoService, HistorialEquipoDTO } from '../services/historial-equipo.service';

@Component({
  selector: 'app-historial-equipo',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './historial-equipo.component.html',
  styleUrls: ['./historial-equipo.component.css']
})
export class HistorialEquipoComponent implements OnInit {
  codigoEquipo: string = '';
  palabraClave: string = '';
  resultados: HistorialEquipoDTO[] = [];

  constructor(private historialService: HistorialEquipoService) {}

  ngOnInit(): void {
    this.obtenerTodoElHistorial();
  }

  obtenerTodoElHistorial(): void {
    this.historialService.obtenerTodo().subscribe(data => {
      this.resultados = data;
    });
  }

  buscarPorCodigo(): void {
    if (!this.codigoEquipo.trim()) return;

    this.historialService.buscarPorCodigo(this.codigoEquipo.trim()).subscribe(data => {
      this.resultados = data;
    });
  }

  buscarPorPalabra(): void {
    if (!this.palabraClave.trim()) return;

    this.historialService.buscarPorPalabraClave(this.palabraClave.trim()).subscribe(data => {
      this.resultados = data;
    });
  }
}
