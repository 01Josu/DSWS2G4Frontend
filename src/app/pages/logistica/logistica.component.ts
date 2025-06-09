import {SolicitudRepuestoService} from '../../services/solicitud-repuesto.service';
import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-logistica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logistica.component.html',
  styleUrls: ['./logistica.component.css']
})
export class LogisticaComponent implements OnInit {
  solicitudes: any[] = [];
  solicitudesFiltradas: any[] = [];
  filtroTexto: string = '';
  solicitudSeleccionada: any = null;
  mensajeExito: string = '';
  mensajeError: string = '';
  cargando: boolean = false;

  constructor(private solicitudService: SolicitudRepuestoService) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.cargando = true;
    this.solicitudService.listarSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar solicitudes:', error);
        this.mensajeError = 'Error al cargar las solicitudes';
        this.cargando = false;
      }
    });
  }

  aplicarFiltros(): void {
    if (!this.filtroTexto.trim()) {
      this.solicitudesFiltradas = [...this.solicitudes];
      return;
    }

    const filtro = this.filtroTexto.toLowerCase();
    this.solicitudesFiltradas = this.solicitudes.filter(solicitud =>
      (solicitud.nombreTecnico?.toLowerCase().includes(filtro)) ||
      (solicitud.nombreRepuesto?.toLowerCase().includes(filtro)) ||
      (solicitud.estado?.toLowerCase().includes(filtro)) ||
      (solicitud.idSolicitud?.toString().includes(filtro))
    );
  }

  confirmarAprobacion(solicitud: any): void {
    this.solicitudSeleccionada = solicitud;
    const modal = new bootstrap.Modal(document.getElementById('modalConfirmarAprobacion'));
    modal.show();
  }

  confirmarRechazo(solicitud: any): void {
    this.solicitudSeleccionada = solicitud;
    const modal = new bootstrap.Modal(document.getElementById('modalConfirmarRechazo'));
    modal.show();
  }

  verDetalles(solicitud: any): void {
    this.solicitudSeleccionada = solicitud;
    const modal = new bootstrap.Modal(document.getElementById('modalDetallesSolicitud'));
    modal.show();
  }

  aprobarSolicitud(): void {
    if (!this.solicitudSeleccionada) return;

    this.cargando = true;
    this.solicitudService.aprobarSolicitud(this.solicitudSeleccionada.id).subscribe({
      next: (response) => {
        this.mensajeExito = 'Solicitud aprobada correctamente';
        this.mensajeError = '';
        this.cargarSolicitudes();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al aprobar solicitud:', error);
        this.mensajeError = 'Error al aprobar la solicitud';
        this.mensajeExito = '';
        this.cargando = false;
      }
    });
  }

  rechazarSolicitud(): void {
    if (!this.solicitudSeleccionada) return;

    this.cargando = true;
    this.solicitudService.rechazarSolicitud(this.solicitudSeleccionada.id).subscribe({
      next: (response) => {
        this.mensajeExito = 'Solicitud rechazada correctamente';
        this.mensajeError = '';
        this.cargarSolicitudes();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al rechazar solicitud:', error);
        this.mensajeError = 'Error al rechazar la solicitud';
        this.mensajeExito = '';
        this.cargando = false;
      }
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'PENDIENTE':
        return 'bg-warning text-dark';
      case 'ATENDIDO':
        return 'bg-success';
      case 'RECHAZADO':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}
