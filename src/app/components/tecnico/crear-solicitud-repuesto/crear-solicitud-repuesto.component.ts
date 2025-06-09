import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitudRepuestoService } from '../../../services/solicitud-repuesto.service';
import { RepuestoInterface } from '../../../interfaces/repuesto.interface';
import { DetalleSolicitudInterface } from '../../../interfaces/detalle-solicitud.interface';
import { SolicitudRepuestoInterface } from '../../../interfaces/solicitud-repuesto.interface';

@Component({
  selector: 'app-crear-solicitud-repuesto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-solicitud-repuesto.component.html',
  styleUrls: ['./crear-solicitud-repuesto.component.css']
})
export class CrearSolicitudRepuestoComponent implements OnInit {
  repuestos: RepuestoInterface[] = [];
  detalles: DetalleSolicitudInterface[] = [];
  busqueda: string = '';
  idIncidencia: number = 0;
  idTecnico: number = 0;
  mensaje: string = '';

  constructor(
    private solicitudService: SolicitudRepuestoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Validar que el usuario sea técnico
    const loginResponse = localStorage.getItem('loginResponse');
    const usuario = loginResponse ? JSON.parse(loginResponse) : null;

    if (!usuario || usuario.rol !== 'TECNICO') {
      this.router.navigate(['/acceso-denegado']);
      return;
    }

    this.idTecnico = usuario.idEmpleado;
    this.cargarRepuestos();
  }

  cargarRepuestos(): void {
    this.solicitudService.listarRepuestos().subscribe({
      next: (data) => {
        this.repuestos = data;
      },
      error: (error) => {
        console.error('Error al cargar repuestos:', error);
      }
    });
  }

  buscarRepuestos(): void {
    if (this.busqueda.trim()) {
      this.solicitudService.buscarRepuestos(this.busqueda).subscribe({
        next: (data) => {
          this.repuestos = data;
        },
        error: (error) => {
          console.error('Error en búsqueda:', error);
        }
      });
    } else {
      this.cargarRepuestos();
    }
  }

  agregarRepuesto(repuesto: RepuestoInterface): void {
    const detalleExistente = this.detalles.find(d => d.idRepuesto === repuesto.id);
    
    if (detalleExistente) {
      detalleExistente.cantidad++;
    } else {
      this.detalles.push({
        idRepuesto: repuesto.id!,
        nombreRepuesto: repuesto.nombre,
        cantidad: 1,
        descripcion: repuesto.descripcion
      });
    }
  }

  eliminarDetalle(index: number): void {
    this.detalles.splice(index, 1);
  }

  modificarCantidad(detalle: DetalleSolicitudInterface, nuevaCantidad: number): void {
    if (nuevaCantidad > 0) {
      detalle.cantidad = nuevaCantidad;
    }
  }

  enviarSolicitud(): void {
    if (this.detalles.length === 0) {
      this.mensaje = 'Debe agregar al menos un repuesto';
      return;
    }

    if (this.idIncidencia === 0) {
      this.mensaje = 'Debe especificar el ID de la incidencia';
      return;
    }

    const solicitud: SolicitudRepuestoInterface = {
      idIncidencia: this.idIncidencia,
      idTecnico: this.idTecnico,
      detalles: this.detalles
    };

    this.solicitudService.registrarSolicitud(solicitud).subscribe({
      next: (response) => {
        this.mensaje = 'Solicitud enviada exitosamente';
        this.detalles = [];
        this.idIncidencia = 0;
      },
      error: (error) => {
        this.mensaje = 'Error al enviar solicitud: ' + error.error;
      }
    });
  }
}