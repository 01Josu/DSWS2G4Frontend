import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { IncidenciaComponent } from './pages/incidencia/incidencia.component';
import { ListaIncidenciasComponent } from './components/tecnico/lista-incidencias/lista-incidencias.component';
import { RolJefeGuard } from './guard/rol-jefe.guard';
import { AsignarIncidenciaComponent } from './pages/asignar-incidencia/asignar-incidencia.component';
import { RepuestoComponent } from './pages/logistica/repuesto/repuesto.component';
import { DetalleIncidenciaComponent } from './detalle-incidencia/detalle-incidencia.component';
import { DetalleIncidenciaPublicaComponent } from './detalle-incidencia-publica/detalle-incidencia-publica.component';
import { HistorialEquipoComponent } from './historial-equipo/historial-equipo.component';
import { SolicitudRepuestoComponent } from './pages/logistica/solicitud-repuesto/solicitud-repuesto.component';
import { GestionarIncidenciasComponent } from './pages/gestionar-incidencias/gestionar-incidencias.component';
import { GestionarUsuariosComponent } from './pages/gestionar-empleados/gestionar-empleados.component';
import { ReporteIncidenciasComponent } from './components/reporte-incidencias/reporte-incidencias.component';
import { DashboardJefeTecnicoComponent } from './pages/dashboard-jefe-tecnico/dashboard-jefe-tecnico.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'incidencia', component: IncidenciaComponent },
  { path: 'tecnico/incidencias', component: ListaIncidenciasComponent },
  { path: 'detalle-incidencia/:id', component: DetalleIncidenciaComponent },
  { path: 'incidencia/:id/editar', component: DetalleIncidenciaPublicaComponent },
  { path: 'logistica/repuestos', component: RepuestoComponent, canActivate: [RolJefeGuard] },
  { path: 'logistica/solicitud-repuesto', component: SolicitudRepuestoComponent, canActivate: [RolJefeGuard] },
  { path: 'historial-equipo', component: HistorialEquipoComponent },
  { path: 'jefe/asignar-incidencia', component: AsignarIncidenciaComponent, canActivate: [RolJefeGuard]},
  { path: 'jefe/incidencias', component: GestionarIncidenciasComponent, canActivate: [RolJefeGuard]},
  { path: 'jefe/usuarios', component: GestionarUsuariosComponent, canActivate: [RolJefeGuard]},
  { path: 'reporte-incidencias', component: ReporteIncidenciasComponent, canActivate: [RolJefeGuard]},
  { path: 'dashboard-jefe-tecnico', component: DashboardJefeTecnicoComponent, canActivate: [RolJefeGuard]}

];
