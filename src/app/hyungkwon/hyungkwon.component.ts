import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';


export type SA = d3.Selection<d3.BaseType, {}, any, {}>;

@Component({
  selector: 'app-hyungkwon',
  templateUrl: './hyungkwon.component.html',
  styleUrls: ['./hyungkwon.component.css']
})
export class HyungkwonComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  constructor() { }

  ngOnInit() {
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    this.barChartData[0].data = data;
  }
}



// constructor() { }

// ngOnInit() {
//   this.createChart();
// }

// public createChart(): any {
  
//   const my_iris: any = iris;

//   // set the dimensions and margins of the graph
//   const margin: any = {top: 3, right: 3, bottom: 3, left: 3},
//       width = 460 - margin.left - margin.right,
//       height = 400 - margin.top - margin.bottom;

//   // append the svg object to the body of the page
//   const svg: SA = d3.select("#viz_example")
//     .append("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//   // Add X axis
//   let x: any = d3.scaleLinear()
//   .domain([0, 4000])
//   .range([ 0, width]);
//   svg.append("g")
//   .attr("transform", "translate(0," + height + ")")
//   .call(d3.axisBottom(x));
  
//   // Add Y axis
//   let y: any = d3.scaleLinear()
//   .domain([0, 500000])
//   .range([ height, 0]);
//   svg.append("g")
//   .call(d3.axisLeft(y));
  
//   // Add dots
//   svg.append('g')
//   .selectAll("dot")
//   .data(my_iris)
//   .enter()
//   .append("circle")
//   .attr("cx", my_iris => x(my_iris[0]))
//   .attr("cy", d => y(my_iris[1]))
//   .attr("r", 1.5)
//   .style("fill", "#69b3a2")
  
//   // const loc: string = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv";
//   //Read the data
//   // d3.csv(loc, function(data: any): any {
//   // });