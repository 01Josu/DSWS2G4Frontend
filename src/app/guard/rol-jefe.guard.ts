import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RolJefeGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const loginResponse = localStorage.getItem('loginResponse');
    const usuario = loginResponse ? JSON.parse(loginResponse) : null;

    const rolesPermitidos = ['JEFE_AREA', 'LOGISTICA'];

    if (usuario && rolesPermitidos.includes(usuario.rol)) {
      return true;
    }

    this.router.navigate(['/acceso-denegado']);
    return false;
  }
}
