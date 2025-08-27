import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions1: Partial<ChartOptions>;

  constructor() { 
    this.chartOptions1 = {
      series: [
        {
          name: 'Mobile Phone',
          color:'#09c28c',
          data: [40, 41, 42, 43, 44, 45,46, 47, 48, 49, 50, 51]
        },
        {
          name: 'Smart Watch',
          color:'#1dadf6',
          data: [50, 51, 52, 53,54, 55,56, 57, 58, 59,60, 61]
        }, 
        {
          name: 'Laptops',
          color:'#ff87b4',
          data: [60, 61, 62, 63, 64, 65,66, 67, 68, 69, 60, 71]
        }, 
        {
          name: 'Gaming Console',
          color:'#ffa448',
          data: [30, 31, 32, 33, 34, 35,36, 37, 38, 39,30, 31]
        }, 
        {
          name: 'Desktop',
          color:'#91cdf2',
          data: [40, 41, 42, 43, 44, 45,46, 47, 48, 49, 50, 51]
        }, 
        {
          name: 'Tablet',
          color:'#b679f2',
          data: [50, 51, 52, 53,54, 55,56, 57, 58, 59,60, 61]
        }
      ],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {show: !1}
      },
      
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
      },
      
      // fill: {
      //   opacity: 1
      // },
      // legend: {
      //   position: "right",
      //   offsetX: 0,
      //   offsetY: 50
      // }
    };
  }

  ngOnInit(): void {
  }

}
