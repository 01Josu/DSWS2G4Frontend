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
  selectedRole: string = '';
  constructor(private authService: AuthService, private router: Router) {}
  closeModal() {
    this.router.navigate(['/']); // redirige al home
  }
  // Función para seleccionar el rol
  selectRole(role: string): void {
    this.selectedRole = role;
  }

  onRegister(event: Event): void {
    event.preventDefault();

    const email = (document.getElementById('registerEmail') as HTMLInputElement).value;
    const password = (document.getElementById('registerPassword') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (!this.selectedRole) {
      alert('Debes seleccionar un rol');
      return;
    }

    const registroData = {
      username: email,
      password_hash: password,
      role: this.selectedRole
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
