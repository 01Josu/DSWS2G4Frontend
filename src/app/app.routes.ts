import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { IncidenciaComponent } from './pages/incidencia/incidencia.component';
import { ListaIncidenciasComponent } from './components/tecnico/lista-incidencias/lista-incidencias.component';
import { RolJefeGuard } from './guard/rol-jefe.guard';
import { AsignarIncidenciaComponent } from './pages/asignar-incidencia/asignar-incidencia.component';
import { DetalleIncidenciaComponent } from './detalle-incidencia/detalle-incidencia.component'; // 👈 Asegúrate de importar
import { RepuestoComponent } from './pages/logistica/repuesto/repuesto.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'incidencia', component: IncidenciaComponent },
  { path: 'tecnico/incidencias', component: ListaIncidenciasComponent },
  { path: 'detalle-incidencia/:id', component: DetalleIncidenciaComponent },
  { path: 'asignar-incidencia', component: AsignarIncidenciaComponent, canActivate: [RolJefeGuard]},
  { path: 'logistica/repuestos', component: RepuestoComponent, canActivate: [RolJefeGuard] },
];
