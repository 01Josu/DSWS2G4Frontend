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

  nuevoUsuario: UsuarioSolicitante = {
    correoNumero: '',
    prioridadUsuario: 1,
    equipo: {
      idEquipo: 1
    }
  };

  editando: boolean = false;
  idEditando: number | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.usuarioService.listar().subscribe(data => {
      this.usuarios = data;
      this.mensaje = '';
    });
  }

  buscarPorId(): void {
    if (this.filtroId !== null) {
      this.usuarioService.buscarPorId(this.filtroId).subscribe({
        next: (usuario) => {
          this.usuarios = [usuario];
          this.mensaje = '';
        },
        error: () => {
          this.mensaje = 'Usuario no encontrado';
          this.usuarios = [];
        }
      });
    } else {
      this.obtenerUsuarios();
    }
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.eliminar(id).subscribe(() => {
        this.obtenerUsuarios();
      });
    }
  }

  guardarUsuario(): void {
    if (this.editando && this.idEditando !== null) {
      this.usuarioService.actualizar(this.idEditando, this.nuevoUsuario).subscribe(() => {
        this.obtenerUsuarios();
        this.editando = false;
        this.idEditando = null;
      });
    } else {
      this.usuarioService.crear(this.nuevoUsuario).subscribe(() => {
        this.obtenerUsuarios();
      });
    }
  }

  editarUsuario(usuario: UsuarioSolicitante): void {
    this.nuevoUsuario = { ...usuario };
    this.editando = true;
    this.idEditando = usuario.id || null;
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.idEditando = null;
    this.nuevoUsuario = {
      correoNumero: '',
      prioridadUsuario: 1,
      equipo: {
        idEquipo: 1
      }
    };
  }
}
