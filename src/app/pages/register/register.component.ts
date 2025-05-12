import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private authService: AuthService, private router: Router) {}
  closeModal() {
    this.router.navigate(['/']); // redirige al home
  }

  onRegister(event: Event): void {
    event.preventDefault();

    const email = (document.getElementById('registerEmail') as HTMLInputElement).value;
    const nombre = (document.getElementById('registerUsername') as HTMLInputElement).value;
    const password = (document.getElementById('registerPassword') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const registroData = {
      nombre,
      username: email,
      password_hash: password
    };

    this.authService.register(registroData).subscribe({
      next: () => {
        alert('Registro exitoso');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Error al registrar');
        console.error(err);
      }
    });
  }
}
