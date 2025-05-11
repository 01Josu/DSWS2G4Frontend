import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-incidencia',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './incidencia.component.html',
  styleUrl: './incidencia.component.css'
})
export class IncidenciaComponent {

}
