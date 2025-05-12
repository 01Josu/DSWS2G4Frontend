import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../pages/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
    // No es necesario redireccionar, router-link lo hará
  }

  getUserRole(): string | null {
    try {
      const loginResponse = localStorage.getItem('loginResponse');
      if (loginResponse) {
        const userData = JSON.parse(loginResponse);
        return userData.rol;
      }
    } catch (e) {
      console.error('Error al obtener rol de usuario:', e);
    }
    return null;
  }

  isTecnico(): boolean {
    return this.getUserRole() === 'TECNICO';
  }
}
