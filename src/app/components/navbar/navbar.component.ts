import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router, NavigationStart  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../pages/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  private primeraCarga = true;
  mostrarComoNoLogueado = false;
  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    // No es necesario redireccionar, router-link lo hará
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.primeraCarga && event.url === '/') {
          // Primera carga en ruta "/"
          this.mostrarComoNoLogueado = true;
          this.primeraCarga = false;
        } else {
          // Cualquier otra navegación o recarga
          this.mostrarComoNoLogueado = false;
          this.primeraCarga = false;
        }
      }
    });
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

  isLogistica(): boolean {
    return this.getUserRole() === 'LOGISTICA';
  }

  isLoggedIn(): boolean {
    if (this.mostrarComoNoLogueado) {
      return false; // fingir no autenticado solo en la primera carga en "/"
    }
    return this.authService.isLoggedIn();
  }
}
