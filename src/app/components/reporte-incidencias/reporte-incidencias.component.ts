import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IncidenciaService } from '../../services/incidencia.service';
import { ReporteIncidenciaInterface } from '../../interfaces/reporte-incidencia.interface';

@Component({
  selector: 'app-reporte-incidencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-incidencias.component.html',
  styleUrl: './reporte-incidencias.component.css'
})
export class ReporteIncidenciasComponent implements OnInit {

  incidencias: ReporteIncidenciaInterface[] = [];
  incidenciasFiltradas: ReporteIncidenciaInterface[] = [];
  fechaInicio: string = '';
  fechaFin: string = '';
  cargando: boolean = false;
  mensaje: string = '';

  // Filtros
  filtroEstado: string = '';
  filtroTecnico: string = '';
  filtroPrioridad: string = '';

  // Estadísticas
  totalIncidencias: number = 0;
  incidenciasPendientes: number = 0;
  incidenciasEnProceso: number = 0;
  incidenciasSolucionadas: number = 0;

  constructor(
    private incidenciaService: IncidenciaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const loginResponse = localStorage.getItem('loginResponse');
    const usuario = loginResponse ? JSON.parse(loginResponse) : null;

    if (!usuario || usuario.rol !== 'JEFE_AREA') {
      this.router.navigate(['/acceso-denegado']);
      return;
    }

    // Cargar reporte inicial (últimos 30 días)
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaFin.getDate() - 30);

    this.fechaInicio = fechaInicio.toISOString().split('T')[0];
    this.fechaFin = fechaFin.toISOString().split('T')[0];

    this.generarReporte();
  }

  generarReporte(): void {
    if (this.fechaInicio && this.fechaFin && this.fechaInicio > this.fechaFin) {
      this.mensaje = 'La fecha de inicio no puede ser mayor que la fecha de fin.';
      return;
    }

    this.cargando = true;
    this.mensaje = '';

    const fechaInicioISO = this.fechaInicio ? new Date(this.fechaInicio).toISOString() : undefined;
    const fechaFinISO = this.fechaFin ? new Date(this.fechaFin + 'T23:59:59').toISOString() : undefined;

    this.incidenciaService.generarReporteIncidencias(fechaInicioISO, fechaFinISO).subscribe({
      next: (data) => {
        this.incidencias = data;
        this.aplicarFiltros();
        this.calcularEstadisticas();
        this.cargando = false;

        if (data.length === 0) {
          this.mensaje = 'No se encontraron incidencias en el rango de fechas seleccionado.';
        }
      },
      error: (error) => {
        console.error('Error al generar reporte:', error);
        this.mensaje = 'Error al generar el reporte. Inténtelo nuevamente.';
        this.cargando = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.incidenciasFiltradas = this.incidencias.filter(inc => {
      const coincideEstado = !this.filtroEstado || inc.estado.toLowerCase().includes(this.filtroEstado.toLowerCase());
      const coincideTecnico = !this.filtroTecnico || (inc.tecnicoAsignado && inc.tecnicoAsignado.toLowerCase().includes(this.filtroTecnico.toLowerCase()));
      const coincidePrioridad = !this.filtroPrioridad || inc.prioridad.toString() === this.filtroPrioridad;

      return coincideEstado && coincideTecnico && coincidePrioridad;
    });

    this.calcularEstadisticas();
  }

  calcularEstadisticas(): void {
    this.totalIncidencias = this.incidenciasFiltradas.length;
    this.incidenciasPendientes = this.incidenciasFiltradas.filter(inc => inc.estado === 'pendiente').length;
    this.incidenciasEnProceso = this.incidenciasFiltradas.filter(inc => inc.estado === 'en_proceso').length;
    this.incidenciasSolucionadas = this.incidenciasFiltradas.filter(inc => inc.estado === 'solucionado').length;
  }

  limpiarFiltros(): void {
    this.filtroEstado = '';
    this.filtroTecnico = '';
    this.filtroPrioridad = '';
    this.aplicarFiltros();
  }

  exportarCSV(): void {
    if (this.incidenciasFiltradas.length === 0) {
      this.mensaje = 'No hay datos para exportar.';
      return;
    }

    const headers = ['ID', 'Correo Solicitante', 'Código Equipo', 'Problema', 'Estado', 'Modalidad', 'Fecha Registro', 'Técnico Asignado', 'Prioridad', 'Categoría', 'Subcategoría'];
    const csvContent = [
      headers.join(','),
      ...this.incidenciasFiltradas.map(inc => [
        inc.idIncidencia,
        `"${inc.correoSolicitante}"`,
        inc.codigoEquipo,
        `"${inc.problema}"`,
        inc.estado,
        inc.modalidadAtencion,
        new Date(inc.fechaRegistro).toLocaleString(),
        `"${inc.tecnicoAsignado || 'Sin asignar'}"`,
        inc.prioridad,
        `"${inc.categoria}"`,
        `"${inc.subcategoria}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte-incidencias-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'bg-secondary';
      case 'en_proceso': return 'bg-warning text-dark';
      case 'solucionado': return 'bg-success';
      default: return 'bg-light text-dark';
    }
  }

  getPrioridadClass(prioridad: number): string {
    if (prioridad >= 8) return 'bg-danger text-white';
    if (prioridad >= 6) return 'bg-warning text-dark';
    if (prioridad >= 4) return 'bg-info text-white';
    return 'bg-light text-dark';
  }
}
