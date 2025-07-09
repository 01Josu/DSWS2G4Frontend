import { Component, OnInit } from '@angular/core';
import { UsuarioService, UsuarioSolicitante } from '../../services/empleado.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestionar-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionar-empleados.component.html',
  styleUrls: ['./gestionar-empleados.component.css']
})
export class GestionarUsuariosComponent implements OnInit {
  usuarios: UsuarioSolicitante[] = [];
  filtroId: number | null = null;
  mensaje: string = '';
  cargando: boolean = false; // ✅ Nuevo indicador de carga

  nuevoUsuario: UsuarioSolicitante = {
    correoNumero: '',
    datosEmpleado: {
      nombre: '',
      apellido: '',
      dni: '',
      celular: ''
    }
  };

  editando: boolean = false;
  idEditando: number | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.cargando = true; // ✅ empieza carga
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.mensaje = '';
        this.cargando = false; // ✅ termina carga
      },
      error: () => {
        this.mensaje = 'Error al cargar los usuarios';
        this.usuarios = [];
        this.cargando = false;
      }
    });
  }

  buscarPorId(): void {
    if (this.filtroId !== null) {
      this.cargando = true;
      this.usuarioService.buscarPorId(this.filtroId).subscribe({
        next: (usuario) => {
          this.usuarios = [usuario];
          this.mensaje = '';
          this.cargando = false;
        },
        error: () => {
          this.mensaje = 'Usuario no encontrado';
          this.usuarios = [];
          this.cargando = false;
        }
      });
    } else {
      this.obtenerUsuarios();
    }
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.cargando = true;
      this.usuarioService.eliminar(id).subscribe(() => {
        this.obtenerUsuarios();
      });
    }
  }

  guardarUsuario(): void {
    this.cargando = true;
    if (this.editando && this.idEditando !== null) {
      this.usuarioService.actualizar(this.idEditando, this.nuevoUsuario).subscribe(() => {
        this.obtenerUsuarios();
        this.editando = false;
        this.idEditando = null;
        this.cargando = false;
      });
    } else {
      this.usuarioService.crear(this.nuevoUsuario).subscribe(() => {
        this.obtenerUsuarios();
        this.cargando = false;
      });
    }
  }

  editarUsuario(usuario: UsuarioSolicitante): void {
    this.nuevoUsuario = {
      id: usuario.id,
      correoNumero: usuario.correoNumero,
      datosEmpleado: {
        nombre: usuario.datosEmpleado?.nombre || '',
        apellido: usuario.datosEmpleado?.apellido || '',
        dni: usuario.datosEmpleado?.dni || '',
        celular: usuario.datosEmpleado?.celular || ''
      }
    };
    this.editando = true;
    this.idEditando = usuario.id || null;
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.idEditando = null;
    this.nuevoUsuario = {
      correoNumero: '',
      datosEmpleado: {
        nombre: '',
        apellido: '',
        dni: '',
        celular: ''
      }
    };
  }

  // ✅ Para mejorar el renderizado de *ngFor
  trackById(index: number, item: UsuarioSolicitante): number | undefined {
    return item.id;
  }
}
// 