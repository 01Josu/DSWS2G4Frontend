import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SolicitudRepuestoInterface } from '../../../interfaces/solicitud-repuesto.interface';
import { SolicitudRepuestoService } from '../../../services/solicitud-repuesto.service';

@Component({
  selector: 'app-solicitud-repuesto',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './solicitud-repuesto.component.html',
  styleUrls: ['./solicitud-repuesto.component.css']
})
export class SolicitudRepuestoComponent implements OnInit {

  solicitudes: any[] = [];
  solicitudesFiltradas: any[] = [];
  terminoBusqueda: string = '';
  cargando: boolean = false;
  mensaje: string = '';

  constructor(
    private solicitudService: SolicitudRepuestoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const loginResponse = localStorage.getItem('loginResponse');
    const usuario = loginResponse ? JSON.parse(loginResponse) : null;

    if (!usuario || usuario.rol !== 'LOGISTICA') {
      this.router.navigate(['/acceso-denegado']);
      return;
    }

    this.obtenerSolicitudes();
  }

  obtenerSolicitudes(): void {
    this.cargando = true;
    this.solicitudService.listarSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.solicitudesFiltradas = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar solicitudes:', error);
        this.mensaje = 'Error al cargar las solicitudes';
        this.cargando = false;
      }
    });
  }

  filtrarSolicitudes(): void {
    if (!this.terminoBusqueda.trim()) {
      this.solicitudesFiltradas = this.solicitudes;
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase();
    this.solicitudesFiltradas = this.solicitudes.filter(solicitud =>
        // Buscar por ID
        solicitud.id?.toString().includes(termino) ||
        // Buscar por nombre del técnico
        solicitud.nombreTecnico?.toLowerCase().includes(termino) ||
        // Buscar por nombre del repuesto
        solicitud.nombreRepuesto?.toLowerCase().includes(termino) ||
        // Buscar por estado
        solicitud.estado?.toLowerCase().includes(termino) ||
        // Buscar por código de repuesto (si comienza con "rRI")
        (termino.startsWith('ri') &&
          solicitud.codigoRepuesto?.toLowerCase().startsWith(termino))
    );
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.solicitudesFiltradas = this.solicitudes;
  }

  aprobar(id: number): void {
    if (confirm('¿Está seguro de aprobar esta solicitud?')) {
      this.solicitudService.aprobarSolicitud(id).subscribe({
        next: (response) => {
          this.mensaje = 'Solicitud aprobada exitosamente';
          this.obtenerSolicitudes(); // Recargar la lista
        },
        error: (error) => {
          this.mensaje = 'Error al aprobar la solicitud: ' + error.error;
        }
      });
    }
  }

  rechazar(id: number): void {
    if (confirm('¿Está seguro de rechazar esta solicitud?')) {
      this.solicitudService.rechazarSolicitud(id).subscribe({
        next: (response) => {
          this.mensaje = 'Solicitud rechazada exitosamente';
          this.obtenerSolicitudes(); // Recargar la lista
        },
        error: (error) => {
          this.mensaje = 'Error al rechazar la solicitud: ' + error.error;
        }
      });
    }
  }

  getEstadoClass(estado: string): string {
    switch(estado?.toUpperCase()) {
      case 'PENDIENTE': return 'bg-warning text-dark';
      case 'ATENDIDO': return 'bg-success';
      case 'RECHAZADO': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getEstadoIcon(estado: string): string {
    switch(estado?.toUpperCase()) {
      case 'PENDIENTE': return 'bi bi-clock';
      case 'ATENDIDO': return 'bi bi-check-circle';
      case 'RECHAZADO': return 'bi bi-x-circle';
      default: return 'bi bi-question-circle';
    }
  }
}
