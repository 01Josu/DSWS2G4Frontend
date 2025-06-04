import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncidenciaService } from '../services/incidencia.service';
import { IncidenciaInterface } from '../interfaces/incidencia.interface';
import { CommonModule } from '@angular/common';
import { SolucionRequest } from '../interfaces/Solucion.Interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalle-incidencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-incidencia.component.html',
  styleUrl: './detalle-incidencia.component.css'
})
export class DetalleIncidenciaComponent implements OnInit{
  idIncidencia!: number;
  incidencia!: IncidenciaInterface | null;
  cargando: boolean = false;
  error: string = '';

  soluciones: any[] = [];
  solucionRequest: SolucionRequest = {
    idIncidencia: 0,
    idSolucion: null as any,
    palabrasClave: '',
    modalidadAtencion: '',
    estado: ''
  };
  mensajeExito: string = '';
  solucionSeleccionada: any = null;
  constructor(
    private route: ActivatedRoute,
    private incidenciaService: IncidenciaService,
  ) {}

  prioridadesMap: { [key: number]: string } = {
    1: 'baja',
    2: 'media',
    3: 'alta',
    4: 'muy alta',
    5: 'crítica'
    // agrega más si necesitas
  };

  ngOnInit(): void {
    this.idIncidencia = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.idIncidencia) {
      this.error = 'ID de incidencia inválido';
      return;
    }
    this.solucionRequest.idIncidencia = this.idIncidencia;
    this.cargarIncidencia();
    this.cargarSoluciones();
  }
  getPrioridadTexto(prioridad: number): string {
    return this.prioridadesMap[prioridad] || `Prioridad #${prioridad}`;
  }

  cargarSoluciones() {
    this.incidenciaService.obtenerSolucionesPorId(this.idIncidencia).subscribe({
      next: (soluciones) => {
        console.log('Soluciones cargadas:', soluciones);
        if (Array.isArray(soluciones)) {
          this.soluciones = soluciones.map((s: any) => ({
            id:s.id,
            solucion: s.solucionProblema
          }));
        } else {
          console.error('❌ Respuesta no es un arreglo:', soluciones);
          this.error = 'Formato de respuesta inesperado';
        }
      },
      error: (err) => {
        console.error('❌ Error cargando soluciones:', err);
        this.error = 'Error al cargar las soluciones disponibles';
      }
    });

  }
  registrarSolucion() {
    if (!this.solucionSeleccionada) {
      this.error = 'Debe seleccionar una solución válida';
      return;
    }
    this.solucionRequest.idSolucion = this.solucionSeleccionada.id;
    this.incidenciaService.registrarSolucion(this.solucionRequest).subscribe({
      next: () => {
        this.mensajeExito = '✅ Solución registrada correctamente';
      },
      error: () => {
        this.error = '❌ Error al registrar la solución';
      }
    });
  }

  cargarIncidencia() {
    this.cargando = true;
    this.error = '';
    this.incidenciaService.getIncidenciaPorId(this.idIncidencia).subscribe({
      next: (data) => {
        console.log('Incidencia recibida:', data);
        this.incidencia = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar la incidencia';
        this.cargando = false;
      }
    });
  }
}
