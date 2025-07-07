import { Component, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService, TicketsPorTecnico } from '../../services/dashboard.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  plotOptions?: any;
  dataLabels?: any;
  tooltip?: any;
  colors?: any[];
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

  public chartProblemas: Partial<ChartOptions> = {
    series: [{ name: 'Cantidad', data: [] }],
    chart: { height: 350, type: 'bar' },
    title: { text: 'Problemas más Frecuentes', align: 'left' },
    xaxis: { categories: [] }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getTicketsPorTecnico().subscribe(data => {
      const nombres = data.map((d: any) => d.nombreTecnico);
      const tickets = data.map((d: any) => d.totalTickets);
      const colores = this.generateColors(data.length);

      this.chartOptions = {
        series: [
          {
            name: "Tickets",
            data: tickets
          }
        ],
        chart: {
          type: "bar",
          height: 350
        },
        plotOptions: {
          bar: {
            distributed: true,
            borderRadius: 6,
            columnWidth: '40%'
          }
        },
        dataLabels:{
          enabled: true,
        },
        colors: colores,
        title: {
          text: 'Carga de Tickets por Técnico',
          align: 'left',
          style: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333'
          }
        },
        xaxis: {
          categories: nombres
        },
        tooltip:{
          enabled: true,
        }
      };
    });

    // Cargar problemas frecuentes
    this.dashboardService.getProblemasFrecuentes().subscribe(data => {
      this.chartProblemas.series = [{
        name: 'Cantidad',
        data: data.map(d => d.cantidad)
      }];
      this.chartProblemas.xaxis = {
        categories: data.map(d => d.nombreProblema)
      };
      this.chartProblemas.title = {
        text: 'Problemas más Frecuentes',
        align: 'left',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333'
        }
      };
      this.chartProblemas.plotOptions = {
        bar: {
          horizontal: true,
          distributed: true,
          borderRadius: 4
        }
      };
      this.chartProblemas.dataLabels = {
        enabled: true
      };
      this.chartProblemas.tooltip = {
        enabled: true
      };
      this.chartProblemas.chart = {
        type: 'bar',
        height: 350
      };
      this.chartProblemas.colors = this.generateColors(data.length);
    });
  }

  generateColors(length: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < length; i++) {
      const color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      colors.push(color);
    }
    return colors;
  }

}