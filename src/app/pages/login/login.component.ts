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
      username: this.username, // correo electrónico
      password_hash: this.password // contraseña en texto claro
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        console.log('Token guardado:', response.token);
        alert('Inicio de sesión exitoso');
        this.router.navigate(['/home']); // redirige a la página principal
        this.closeModal();
      },
      error: (err) => {
        alert('Error de inicio de sesión');
        console.error(err);
      }
    });
    console.log("Email en onLogin():", this.username);
    console.log("Password:", this.password);
    

  }
}
