import { Component } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, NgApexchartsModule } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboard-jefe-tecnico',
  imports: [NgApexchartsModule],
  templateUrl: './dashboard-jefe-tecnico.component.html',
  styleUrls: ['./dashboard-jefe-tecnico.component.css']
})
export class DashboardJefeTecnicoComponent {
  public chartOptions: ChartOptions = {
    series: [
      {
        name: 'Tickets Atendidos',
        data: [10, 25, 18, 30, 22]
      }
    ],
    chart: {
      height: 350,
      type: 'bar'
    },
    title: {
      text: 'Estadísticas de Atención de Tickets (Últimos 5 días)'
    },
    xaxis: {
      categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie']
    }
  };
}
