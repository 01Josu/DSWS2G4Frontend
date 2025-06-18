import { Component, OnInit } from '@angular/core';
import { RepuestoInterface } from '../../../interfaces/repuesto.interface';
import { RepuestoService } from '../../../services/repuesto.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-repuesto',
  templateUrl: './repuesto.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  styleUrls: ['./repuesto.component.css']
})
export class RepuestoComponent implements OnInit {
  repuestos: RepuestoInterface[] = [];
  repuestosFiltrados: RepuestoInterface[] = [];
  terminoBusqueda: string = '';
  form: RepuestoInterface = {
    codigoRepuesto: '',
    nombre: '',
    descripcion: '',
    cantidad: 0
  };
  editando: boolean = false;

  constructor(
    private repuestoService: RepuestoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const loginResponse = localStorage.getItem('loginResponse');
    const usuario = loginResponse ? JSON.parse(loginResponse) : null;

    if (!usuario || usuario.rol !== 'LOGISTICA') {
      this.router.navigate(['/acceso-denegado']);
      return;
    }
    this.obtenerRepuestos();
  }

  abrirModal() {
    const modalElement = document.getElementById('modalRepuesto');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  cerrarModal() {
    const modalElement = document.getElementById('modalRepuesto');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  obtenerRepuestos(): void {
    this.repuestoService.listarRepuestos().subscribe(data => {
      this.repuestos = data;
      this.repuestosFiltrados = data;
    });
  }

  filtrarRepuestos(): void {
    if (!this.terminoBusqueda.trim()) {
      this.repuestosFiltrados = this.repuestos;
      return;
    }
    const termino = this.terminoBusqueda.toLowerCase();
    this.repuestosFiltrados = this.repuestos.filter(repuesto =>
        // Buscar en código de repuesto (solo si comienza con "ri")
        (termino.startsWith('ri') &&
          repuesto.codigoRepuesto?.toLowerCase().startsWith(termino)) ||
        // Buscar en nombre
        repuesto.nombre?.toLowerCase().includes(termino) ||
        // Buscar en descripción
        repuesto.descripcion?.toLowerCase().includes(termino)
    );
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.repuestosFiltrados = this.repuestos;
  }

  guardarRepuesto(): void {
    if (this.editando && this.form.id) {
      this.repuestoService.actualizarRepuesto(this.form.id, this.form).subscribe(() => {
        this.obtenerRepuestos();
        this.cancelarEdicion();
        this.cerrarModal();
      });
    } else {
      this.repuestoService.crearRepuesto(this.form).subscribe(() => {
        this.obtenerRepuestos();
        this.resetForm();
        this.cerrarModal();
      });
    }
  }

  nuevoRepuesto(): void {
    this.resetForm();       // limpia el formulario
    this.editando = false;  // cambia el estado a 'registrando'
    this.abrirModal();      // abre el modal
  }

  editarRepuesto(repuesto: RepuestoInterface): void {
    this.form = { ...repuesto };
    this.editando = true;
    this.abrirModal();
  }

  eliminarRepuesto(id?: number): void {
    if (id && confirm('¿Estás seguro de eliminar este repuesto?')) {
      this.repuestoService.eliminarRepuesto(id).subscribe(() => {
        this.obtenerRepuestos();
      });
    }
  }

  cancelarEdicion(): void {
    this.resetForm();
    this.editando = false;
  }

  resetForm(): void {
    this.form = {
      codigoRepuesto: '',
      nombre: '',
      descripcion: '',
      cantidad: 0
    };
  }
}
