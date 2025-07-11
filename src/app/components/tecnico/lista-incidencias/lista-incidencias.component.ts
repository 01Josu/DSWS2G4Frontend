import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IncidenciaService } from '../../../services/incidencia.service';
import { SolicitudRepuestoService } from '../../../services/solicitud-repuesto.service';
import { IncidenciaInterface } from '../../../interfaces/incidencia.interface';
import { RepuestoInterface } from '../../../interfaces/repuesto.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-incidencias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lista-incidencias.component.html',
  styleUrl: './lista-incidencias.component.css',
})
export class ListaIncidenciasComponent implements OnInit {
  incidencias: IncidenciaInterface[] = [];
  numeroTicket: string = '';
  tecnicoId: number = 1;
  cargando: boolean = false;
  error: string = '';

  // Variables para el modal de repuestos
  incidenciaSeleccionada: IncidenciaInterface | null = null;
  repuestosDisponibles: RepuestoInterface[] = [];
  repuestosSolicitados: any[] = [];
  mensajeSolicitud: string = '';
  errorSolicitud: string = '';
  cargandoRepuestos: boolean = false;
  busquedaRepuesto: string = '';

  // Variables para gestión de solicitudes
  misSolicitudes: any[] = [];
  solicitudEditando: any = null;
  modoEdicionSolicitud: boolean = false;

  constructor(
    private incidenciaService: IncidenciaService,
    private solicitudRepuestoService: SolicitudRepuestoService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Inicializando componente ListaIncidenciasComponent');
    this.obtenerIdTecnico();
    this.cargarIncidencias();
    this.cargarRepuestos();
    this.cargarMisSolicitudes();
  }

  // Método para obtener el ID del técnico
  private obtenerIdTecnico() {
    try {
      const loginDataStr = localStorage.getItem('loginResponse');
      if (loginDataStr) {
        const loginData = JSON.parse(loginDataStr);
        if (loginData.idEmpleado) {
          this.tecnicoId = loginData.idEmpleado;
          console.log(
            'ID de técnico obtenido del localStorage:',
            this.tecnicoId
          );
        } else {
          console.warn('No se encontró idUsuario en loginResponse');
          this.error = 'No se encontró el ID del usuario en la sesión';
        }
      }
    } catch (e) {
      this.error = 'Error al obtener el ID del usuario';
    }
  }

  cargarIncidencias() {
    if (!this.tecnicoId) {
      this.error = 'ID de técnico no válido';
      return;
    }

    console.log('Cargando incidencias para técnico ID:', this.tecnicoId);
    this.cargando = true;
    this.error = '';

    this.incidenciaService.obtenerIncidenciasTecnico(this.tecnicoId).subscribe({
      next: (data) => {
        console.log('Incidencias cargadas exitosamente:', data);
        this.incidencias = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar incidencias:', error);
        this.error =
          error.error?.message ||
          error.message ||
          'Error al cargar las incidencias.';
        this.cargando = false;
      },
    });
  }

  cargarRepuestos() {
    this.cargandoRepuestos = true;
    this.solicitudRepuestoService.listarRepuestos().subscribe({
      next: (repuestos) => {
        console.log('Repuestos cargados:', repuestos);
        this.repuestosDisponibles = repuestos;
        this.cargandoRepuestos = false;
      },
      error: (error) => {
        console.error('Error al cargar repuestos:', error);
        this.cargandoRepuestos = false;
      },
    });
  }

  buscarPorTicket() {
    if (!this.tecnicoId) {
      this.error = 'ID de técnico no válido';
      return;
    }

    this.cargando = true;
    this.error = '';

    if (this.numeroTicket && this.numeroTicket.trim()) {
      // Buscar en todas las incidencias del técnico y filtrar localmente
      this.incidenciaService
        .obtenerIncidenciasTecnico(this.tecnicoId)
        .subscribe({
          next: (data) => {
            // Filtrar localmente por cualquier campo (excepto fechas)
            const termino = this.numeroTicket.toLowerCase().trim();
            this.incidencias = data.filter(
              (incidencia) =>
                // Buscar en ID/número de ticket
                incidencia.idIncidencia?.toString().includes(termino) ||
                incidencia.id?.toString().includes(termino) ||
                (termino.startsWith('eq') &&
                  incidencia.codigoEquipo?.toLowerCase().startsWith(termino)) ||
                // Si comienza con "EQ", buscar código de equipo
                (termino.startsWith('eq') &&
                  incidencia.codigoEquipo?.toLowerCase().includes(termino)) ||
                // Buscar en descripción del problema
                incidencia.descripcionProblema
                  ?.toLowerCase()
                  .includes(termino) ||
                // Buscar en estado
                incidencia.estado?.toLowerCase().includes(termino) ||
                // Buscar en prioridad
                incidencia.prioridad?.toString().includes(termino)
            );
            this.cargando = false;
          },
          error: (error) => {
            this.error =
              error.error?.message || error.message || 'Error al buscar.';
            this.cargando = false;
          },
        });
    } else {
      // Si no hay término de búsqueda, cargar todas las incidencias
      this.cargarIncidencias();
    }
  }

  getEstadoClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return 'bg-warning';
      case 'en_proceso':
        return 'bg-info';
      case 'solucionado':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  getPrioridadClass(prioridad: number): string {
    if (prioridad >= 8) return 'bg-danger';
    if (prioridad >= 5) return 'bg-warning';
    return 'bg-info';
  }

  verDetalles(incidencia: IncidenciaInterface) {
    console.log('Navegando a detalles de incidencia:', incidencia.idIncidencia);
    this.router.navigate(['/detalle-incidencia', incidencia.idIncidencia]);
  }

  // Métodos mejorados para el modal de repuestos
  abrirSolicitudRepuestos(incidencia: IncidenciaInterface) {
    console.log(
      'Abriendo modal para incidencia:',
      incidencia.idIncidencia || incidencia.id
    );
    this.incidenciaSeleccionada = incidencia;
    this.repuestosSolicitados = [];
    this.mensajeSolicitud = '';
    this.errorSolicitud = '';

    // Recargar repuestos para asegurar stock actualizado
    this.cargarRepuestos();
  }

  agregarRepuesto(repuesto: RepuestoInterface) {
    // Limitar a solo 1 repuesto por solicitud
    if (this.repuestosSolicitados.length >= 1) {
      this.errorSolicitud =
        'Solo se puede solicitar 1 repuesto por vez. Quita el repuesto actual para agregar otro.';
      setTimeout(() => (this.errorSolicitud = ''), 3000);
      return;
    }

    const yaExiste = this.repuestosSolicitados.find(
      (r) => r.id === repuesto.id
    );
    if (!yaExiste) {
      if (repuesto.cantidad > 0) {
        this.repuestosSolicitados.push({
          ...repuesto,
          cantidadSolicitada: 1,
        });
        console.log('Repuesto agregado al carrito:', repuesto.nombre);
      } else {
        this.errorSolicitud = 'No hay stock disponible para este repuesto';
        setTimeout(() => (this.errorSolicitud = ''), 3000);
      }
    } else {
      this.errorSolicitud = 'Este repuesto ya está en el carrito';
      setTimeout(() => (this.errorSolicitud = ''), 3000);
    }
  }

  quitarRepuesto(repuesto: any) {
    this.repuestosSolicitados = this.repuestosSolicitados.filter(
      (r) => r.id !== repuesto.id
    );
    console.log('Repuesto removido del carrito:', repuesto.nombre);
  }

  enviarSolicitudRepuestos() {
    if (
      !this.incidenciaSeleccionada ||
      this.repuestosSolicitados.length === 0
    ) {
      this.errorSolicitud = 'Debe seleccionar al menos un repuesto';
      return;
    }

    // Validar que solo sea 1 repuesto
    if (this.repuestosSolicitados.length > 1) {
      this.errorSolicitud = 'Solo se puede solicitar 1 repuesto por vez';
      return;
    }

    // Validar cantidades
    const repuesto = this.repuestosSolicitados[0];
    if (!repuesto.cantidadSolicitada || repuesto.cantidadSolicitada < 1) {
      this.errorSolicitud = `La cantidad para ${repuesto.nombre} debe ser mayor a 0`;
      return;
    }
    if (repuesto.cantidadSolicitada > repuesto.cantidad) {
      this.errorSolicitud = `La cantidad solicitada para ${repuesto.nombre} excede el stock disponible (${repuesto.cantidad})`;
      return;
    }

    // Obtener ID de incidencia de manera segura
    const idIncidencia =
      this.incidenciaSeleccionada.idIncidencia ||
      this.incidenciaSeleccionada.id;
    if (!idIncidencia) {
      this.errorSolicitud = 'Error: No se pudo obtener el ID de la incidencia';
      return;
    }

    const loginResponse = localStorage.getItem('loginResponse');
    const usuario = loginResponse ? JSON.parse(loginResponse) : null;

    if (!usuario || !usuario.idEmpleado) {
      this.errorSolicitud =
        'Error: No se pudo obtener la información del técnico';
      return;
    }

    const solicitud = {
      idIncidencia: Number(idIncidencia),
      idTecnico: usuario.idEmpleado,
      detalles: [
        {
          idRepuesto: repuesto.id,
          nombreRepuesto: repuesto.nombre,
          cantidad: repuesto.cantidadSolicitada,
          descripcion: repuesto.descripcion,
        },
      ],
    };

    console.log('Enviando solicitud de repuestos:', solicitud);

    this.solicitudRepuestoService.registrarSolicitud(solicitud).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.mensajeSolicitud =
          'Solicitud de repuestos enviada correctamente. El equipo de logística la revisará pronto.';
        this.errorSolicitud = '';
        this.repuestosSolicitados = [];

        // Recargar repuestos para actualizar stock
        this.cargarRepuestos();

        // Cerrar modal después de 3 segundos
        setTimeout(() => {
          this.cerrarModal();
        }, 3000);
      },
      error: (error) => {
        console.error('Error al enviar solicitud:', error);

        // Verificar si realmente es un error o una respuesta exitosa con formato diferente
        if (error.status === 200) {
          // Es una respuesta exitosa, pero Angular lo interpreta como error por el formato
          this.mensajeSolicitud = 'Solicitud enviada correctamente';
          this.errorSolicitud = '';
          this.repuestosSolicitados = [];
          this.cargarRepuestos();
          setTimeout(() => {
            this.cerrarModal();
          }, 3000);
        } else {
          // Es un error real
          let mensajeError = 'Error al enviar la solicitud de repuestos';

          if (error.error) {
            if (typeof error.error === 'string') {
              mensajeError = error.error;
            } else if (error.error.message) {
              mensajeError = error.error.message;
            }
          } else if (error.message) {
            mensajeError = error.message;
          }

          this.errorSolicitud = mensajeError;
          this.mensajeSolicitud = '';
        }
      },
    });
  }

  // Método para cerrar modal programáticamente
  private cerrarModal() {
    const modal = document.getElementById('modalSolicitudRepuestos');
    if (modal) {
      const modalInstance = (window as any).bootstrap?.Modal?.getInstance(
        modal
      );
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  // Método para limpiar mensajes
  limpiarMensajes() {
    this.mensajeSolicitud = '';
    this.errorSolicitud = '';
  }

  cargarMisSolicitudes(): void {
    const loginResponse = localStorage.getItem('loginResponse');
    const usuario = loginResponse ? JSON.parse(loginResponse) : null;

    if (usuario && usuario.idEmpleado) {
      this.solicitudRepuestoService.obtenerSolicitudesPorTecnico(usuario.idEmpleado).subscribe({
        next: (solicitudes) => {
          this.misSolicitudes = solicitudes;
        },
        error: (error) => {
          console.error('Error al cargar solicitudes:', error);
        }
      });
    }
  }

  editarSolicitud(solicitud: any): void {
    if (solicitud.estado !== 'PENDIENTE') {
      this.errorSolicitud = 'Solo se pueden editar solicitudes en estado pendiente';
      return;
    }

    console.log('Solicitud completa a editar:', solicitud);
    this.solicitudEditando = { ...solicitud };
    this.modoEdicionSolicitud = true;

    // Limpiar repuestos anteriores
    this.repuestosSolicitados = [];
    this.cargarRepuestos();

    // CORRECCIÓN: Mapear directamente desde la solicitud principal
    // ya que el backend envía los datos del repuesto en el nivel principal
    if (solicitud) {
      const repuestoActual = {
        id: solicitud.idRepuesto || solicitud.id, // Usar idRepuesto si existe, sino el id
        codigoRepuesto: solicitud.codigoRepuesto,
        nombre: solicitud.nombreRepuesto,
        descripcion: solicitud.descripcionRepuesto || solicitud.descripcion,
        cantidad: 999, // Stock disponible (ficticio para el modal)
        cantidadSolicitada: solicitud.cantidad || 1
      };

      // Verificar que tenemos datos válidos antes de agregar
      if (repuestoActual.codigoRepuesto && repuestoActual.nombre) {
        this.repuestosSolicitados = [repuestoActual];
        console.log('Repuesto actual cargado correctamente:', repuestoActual);
      } else {
        console.warn('Datos del repuesto incompletos:', solicitud);

        // Si los datos principales no están, intentar con detalles
        if (solicitud.detalles && solicitud.detalles.length > 0) {
          const detalle = solicitud.detalles[0];
          const repuestoDesdeDetalle = {
            id: detalle.idRepuesto,
            codigoRepuesto: detalle.codigoRepuesto,
            nombre: detalle.nombreRepuesto,
            descripcion: detalle.descripcionRepuesto,
            cantidad: 999,
            cantidadSolicitada: detalle.cantidad
          };
          this.repuestosSolicitados = [repuestoDesdeDetalle];
          console.log('Repuesto cargado desde detalles:', repuestoDesdeDetalle);
        }
      }
    }

    // Abrir modal de edición
    const modalElement = document.getElementById('modalEditarSolicitud');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  guardarCambiosSolicitud(): void {
    if (!this.solicitudEditando || this.repuestosSolicitados.length === 0) {
      this.errorSolicitud = 'Debe seleccionar al menos un repuesto';
      return;
    }

    const datosActualizados = {
      idIncidencia: this.solicitudEditando.idIncidencia,
      idTecnico: this.tecnicoId,
      detalles: this.repuestosSolicitados.map(rep => ({
        idRepuesto: rep.id,
        nombreRepuesto: rep.nombre,
        cantidad: rep.cantidadSolicitada || 1,
        descripcion: rep.descripcion
      }))
    };

    this.solicitudRepuestoService.editarSolicitudPorTecnico(
      this.solicitudEditando.id,
      this.tecnicoId,
      datosActualizados
    ).subscribe({
      next: (response) => {
        this.mensajeSolicitud = 'Solicitud actualizada correctamente';
        this.errorSolicitud = '';
        this.modoEdicionSolicitud = false;
        this.solicitudEditando = null;
        this.cargarMisSolicitudes(); // Recargar solicitudes

        // Cerrar modal
        const modalElement = document.getElementById('modalEditarSolicitud');
        if (modalElement) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
        }
      },
      error: (error) => {
        console.error('Error al actualizar solicitud:', error);
        if (error.error && error.error.mensaje) {
          this.errorSolicitud = error.error.mensaje;
        } else {
          this.errorSolicitud = 'Error al actualizar la solicitud';
        }
      }
    });
  }

  cancelarEdicionSolicitud(): void {
    this.modoEdicionSolicitud = false;
    this.solicitudEditando = null;
    this.repuestosSolicitados = [];
    this.errorSolicitud = '';
    this.mensajeSolicitud = '';
    this.busquedaRepuesto = '';

    // Cerrar modal
    const modalElement = document.getElementById('modalEditarSolicitud');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  buscarRepuestos(): void {
    if (this.busquedaRepuesto.trim()) {
      const termino = this.busquedaRepuesto.toLowerCase();
      this.repuestosDisponibles = this.repuestosDisponibles.filter(repuesto =>
        repuesto.nombre.toLowerCase().includes(termino) ||
        repuesto.codigoRepuesto.toLowerCase().includes(termino) ||
        repuesto.descripcion.toLowerCase().includes(termino)
      );
    } else {
      // Si no hay búsqueda, mostrar todos
      this.repuestosDisponibles = [...this.repuestosDisponibles];
    }
  }
}
