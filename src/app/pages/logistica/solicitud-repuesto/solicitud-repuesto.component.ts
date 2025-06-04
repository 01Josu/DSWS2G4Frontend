import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SolicitudRepuestoInterface } from '../../../interfaces/solicitud-repuesto.interface';
import { SolicitudRepuestoService } from '../../../services/solicitud-repuesto.service';

@Component({
  selector: 'app-solicitud-repuesto',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './solicitud-repuesto.component.html',
  styleUrls: ['./solicitud-repuesto.component.css']
})
export class SolicitudRepuestoComponent implements OnInit {

  solicitudes: SolicitudRepuestoInterface[] = [];

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
    this.solicitudService.listarSolicitudes().subscribe(data => {
      this.solicitudes = data;
    });
  }

  aprobar(id: any): void {
    this.solicitudService.aprobarSolicitud(id).subscribe(() => {
      this.obtenerSolicitudes();
    });
  }

  rechazar(id: any): void {
    this.solicitudService.rechazarSolicitud(id).subscribe(() => {
      this.obtenerSolicitudes();
    });
  }
  
}
