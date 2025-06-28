import { Component, OnInit } from '@angular/core';
import { EmpleadoService, UsuarioSolicitante } from '../../services/empleado.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestionar-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionar-empleados.component.html',
  styleUrls: ['./gestionar-empleados.component.css']
})
export class GestionarEmpleadosComponent implements OnInit {
  empleados: UsuarioSolicitante[] = [];
  filtroId: number | null = null;
  mensaje: string = '';

  nuevoEmpleado: UsuarioSolicitante = {
    correoNumero: '',
    prioridadUsuario: 1,
    equipo: {
      idEquipo: 1
    }
  };

  editando: boolean = false;
  idEditando: number | null = null;

  constructor(private empleadoService: EmpleadoService) {}

  ngOnInit(): void {
    this.obtenerEmpleados();
  }

  obtenerEmpleados(): void {
    this.empleadoService.listar().subscribe(data => {
      this.empleados = data;
      this.mensaje = '';
    });
  }

  buscarPorId(): void {
    if (this.filtroId !== null) {
      this.empleadoService.buscarPorId(this.filtroId).subscribe({
        next: (empleado) => {
          this.empleados = [empleado];
          this.mensaje = '';
        },
        error: () => {
          this.mensaje = 'Empleado no encontrado';
          this.empleados = [];
        }
      });
    } else {
      this.obtenerEmpleados();
    }
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      this.empleadoService.eliminar(id).subscribe(() => {
        this.obtenerEmpleados();
      });
    }
  }

  crearEmpleado(): void {
    if (!this.nuevoEmpleado.correoNumero || !this.nuevoEmpleado.equipo.idEquipo) {
      alert('Completa los campos necesarios');
      return;
    }

    this.empleadoService.crear(this.nuevoEmpleado).subscribe(() => {
      this.obtenerEmpleados();
      this.nuevoEmpleado = { correoNumero: '', prioridadUsuario: 1, equipo: { idEquipo: 1 } };
    });
  }

  editarEmpleado(empleado: UsuarioSolicitante): void {
    this.editando = true;
    this.idEditando = empleado.id!;
    this.nuevoEmpleado = {
      correoNumero: empleado.correoNumero,
      prioridadUsuario: empleado.prioridadUsuario,
      equipo: {
        idEquipo: empleado.equipo.idEquipo
      }
    };
  }

  guardarEdicion(): void {
    if (this.idEditando === null) return;

    this.empleadoService.actualizar(this.idEditando, this.nuevoEmpleado).subscribe(() => {
      this.obtenerEmpleados();
      this.cancelarEdicion();
    });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.idEditando = null;
    this.nuevoEmpleado = { correoNumero: '', prioridadUsuario: 1, equipo: { idEquipo: 1 } };
  }
}
