import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudRepuestoService } from '../../../services/solicitud-repuesto.service';
import { RepuestoInterface } from '../../../interfaces/repuesto.interface';
import { DetalleSolicitudInterface } from '../../../interfaces/detalle-solicitud.interface';
import { SolicitudRepuestoInterface } from '../../../interfaces/solicitud-repuesto.interface';

declare var bootstrap: any;

@Component({
  selector: 'app-solicitud-repuestos-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitud-repuestos-modal.component.html',
  styleUrl: './solicitud-repuestos-modal.component.css'
})
export class SolicitudRepuestosModalComponent implements OnInit {
  @Input() incidenciaId!: number;
  @Input() tecnicoId!: number;

  repuestos: RepuestoInterface[] = [];
  repuestosFiltrados: RepuestoInterface[] = [];
  solicitudDetalles: DetalleSolicitudInterface[] = [];
  
  busquedaRepuesto: string = '';
  repuestoSeleccionado: RepuestoInterface | null = null;
  cantidadSolicitada: number = 1;
  
  cargando: boolean = false;
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(private solicitudService: SolicitudRepuestoService) {}

  ngOnInit(): void {
    this.cargarRepuestos();
  }

  cargarRepuestos(): void {
    this.solicitudService.listarRepuestos().subscribe({
      next: (data) => {
        this.repuestos = data;
        this.repuestosFiltrados = data;
      },
      error: (error) => {
        this.mensajeError = 'Error al cargar repuestos';
        console.error(error);
      }
    });
  }

  buscarRepuestos(): void {
    if (this.busquedaRepuesto.trim()) {
      this.solicitudService.buscarRepuestos(this.busquedaRepuesto).subscribe({
        next: (data) => {
          this.repuestosFiltrados = data;
        },
        error: (error) => {
          this.mensajeError = 'Error en la búsqueda';
          console.error(error);
        }
      });
    } else {
      this.repuestosFiltrados = this.repuestos;
    }
  }

  seleccionarRepuesto(repuesto: RepuestoInterface): void {
    this.repuestoSeleccionado = repuesto;
    this.cantidadSolicitada = 1;
  }

  agregarRepuesto(): void {
    if (!this.repuestoSeleccionado || this.cantidadSolicitada <= 0) {
      this.mensajeError = 'Seleccione un repuesto y cantidad válida';
      return;
    }

    if (this.cantidadSolicitada > this.repuestoSeleccionado.cantidad!) {
      this.mensajeError = 'La cantidad solicitada excede el stock disponible';
      return;
    }

    // Verificar si ya existe en la lista
    const existeIndex = this.solicitudDetalles.findIndex(
      item => item.idRepuesto === this.repuestoSeleccionado!.id
    );

    if (existeIndex >= 0) {
      // Actualizar cantidad
      this.solicitudDetalles[existeIndex].cantidad += this.cantidadSolicitada;
    } else {
      // Agregar nuevo
      this.solicitudDetalles.push({
        idRepuesto: this.repuestoSeleccionado.id!,
        nombreRepuesto: this.repuestoSeleccionado.nombre,
        cantidad: this.cantidadSolicitada,
        descripcion: this.repuestoSeleccionado.descripcion
      });
    }

    this.repuestoSeleccionado = null;
    this.cantidadSolicitada = 1;
    this.mensajeError = '';
  }

  eliminarRepuesto(index: number): void {
    this.solicitudDetalles.splice(index, 1);
  }

  enviarSolicitud(): void {
    if (this.solicitudDetalles.length === 0) {
      this.mensajeError = 'Debe agregar al menos un repuesto';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    const solicitud: SolicitudRepuestoInterface = {
      idIncidencia: this.incidenciaId,
      idTecnico: this.tecnicoId,
      detalles: this.solicitudDetalles
    };

    this.solicitudService.registrarSolicitud(solicitud).subscribe({
      next: (response) => {
        this.mensajeExito = 'Solicitud de repuestos registrada exitosamente';
        this.solicitudDetalles = [];
        this.cargando = false;
        
        // Cerrar modal después de 2 segundos
        setTimeout(() => {
          this.cerrarModal();
        }, 2000);
      },
      error: (error) => {
        this.mensajeError = error.error || 'Error al registrar la solicitud';
        this.cargando = false;
      }
    });
  }

  cerrarModal(): void {
    // Cerrar el modal
    const modal = document.getElementById('solicitudRepuestosModal');
    if (modal) {
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      }
    }
    
    // Limpiar datos
    this.solicitudDetalles = [];
    this.mensajeExito = '';
    this.mensajeError = '';
    this.repuestoSeleccionado = null;
  }
}