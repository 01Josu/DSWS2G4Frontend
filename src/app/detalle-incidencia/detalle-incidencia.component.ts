import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncidenciaService } from '../services/incidencia.service';
import { IncidenciaInterface } from '../interfaces/incidencia.interface';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';  // <-- Importar Location
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
    idSolucion: 0,
    palabrasClave: '',
    modalidadAtencion: '',
    estado: ''
  };
  mensajeExito: string = '';

  constructor(
    private route: ActivatedRoute,
    private incidenciaService: IncidenciaService,
    private location: Location
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
  volverAtras() {
    this.location.back();  // <-- función para volver atrás
  }
  cargarSoluciones() {
    this.incidenciaService.obtenerSolucionesPorId(this.idIncidencia).subscribe({
      next: (soluciones) => {
        console.log('✅ Soluciones cargadas:', soluciones);
        if (Array.isArray(soluciones)) {
          // Mapear a un formato simplificado (opcional)
          this.soluciones = soluciones.map((s: any) => ({
            id: s.idSolucionProblema,
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
