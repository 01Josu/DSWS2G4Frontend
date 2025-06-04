import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  constructor(private authService: AuthService, private router: Router) {}
  closeModal() {
    this.router.navigate(['/']); // redirige al home
  }
  //Método que se ejecutará cuando se envíe el formulario
  onLogin(event: Event): void {
    event.preventDefault();

    // Aquí usamos las propiedades del componente en lugar de buscar los elementos directamente
    const loginData = {
      username: this.username,
      password_hash: this.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        localStorage.setItem('token', response.token);
        console.log('Token guardado:', response.token);
        console.log('Respuesta completa:', response);

        // Guardar respuesta completa en localStorage
        localStorage.setItem('loginResponse', JSON.stringify(response));

        alert('Inicio de sesión exitoso');

        // Verificar si es técnico y redirigir según el rol
        if (response.rol === 'TECNICO') {
          this.router.navigate(['/tecnico/incidencias']);
        } else if(response.rol === 'JEFE_AREA'){
          this.router.navigate(['/asignar-incidencia'])
        } else if(response.rol === 'LOGISTICA'){
          this.router.navigate(['/logistica/repuestos']);
        } else{
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        alert('Error de inicio de sesión');
        console.error(err);
      }
    });
  }
}
