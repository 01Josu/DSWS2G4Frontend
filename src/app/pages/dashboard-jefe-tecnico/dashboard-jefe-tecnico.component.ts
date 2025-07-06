import { Component, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService, TicketsPorTecnico } from '../../services/dashboard.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboard-jefe-tecnico',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './dashboard-jefe-tecnico.component.html',
  styleUrls: ['./dashboard-jefe-tecnico.component.css']
})
export class DashboardJefeTecnicoComponent implements OnInit {
  public chartOptions: ChartOptions = {
    series: [{ name: 'Tickets Atendidos', data: [] }],
    chart: { height: 350, type: 'bar' },
    title: { text: 'Carga de Tickets por Técnico' },
    xaxis: { categories: [] }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getTicketsPorTecnico().subscribe((data: TicketsPorTecnico[]) => {
      this.chartOptions.series = [{ name: 'Tickets Atendidos', data: data.map(d => d.total) }];
      this.chartOptions.xaxis = { categories: data.map(d => d.tecnico) };
    });
  }
}