import { FilelistService } from './filelist.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import file_list from '../../Preprocessing/preprocessed/file_list.json';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'infovisproj';
  public files = file_list;
  public appData = '';
  public receivedData: Array<any> = [];

  constructor(private _filelistService: FilelistService) { }
  // constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  public updateData($event) {
    console.log('this is update data');
    console.log('event: ' + $event);
    this.appData = $event;
    this._filelistService.getMusic($event)
      .subscribe(data => this.receivedData = data);
  }
}

// public translate(x: any, y: any) {
//   return 'translate(' + x + ', ' + y + ')';
// }

// // set the dimensions and margins of the graph
// public margin: any = {top: 30, right: 50, bottom: 30, left: 80};
// public width: number = 800;
// public height: number = 800;

// public svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
// public x: any;
// public y: any;

// public data_loc = 'assets/mydta.csv';
  
// public colorScale: any = d3.scaleOrdinal()
//   .range(d3.schemeCategory10);

// // initialize svg
// public initSvg(my_id: string) {
//   this.svg = d3.select(my_id)
//     .append("svg")
//       .attr("width", this.width + this.margin.left + this.margin.right)
//       .attr("height", this.height + this.margin.top + this.margin.bottom)
//       .append('g')
//     .attr('transform', this.translate(this.margin.left, this.margin.top));
// }

// // initialize axis
// public initAxis(dta: any) {
//     // Add X axis
//     this.x = d3.scaleLinear()
//       .domain([0, Math.max.apply(Math, dta.map(d => d.GrLivArea))])
//       .range([0, this.width]);
//     this.svg.append("g")
//       .attr("transform", this.translate(0, this.height))
//       .call(d3.axisBottom(this.x));

//     // Add Y axis
//     this.y = d3.scaleLinear()
//       .domain([0, Math.max.apply(Math, dta.map(d => d.SalePrice))])
//       .range([this.height, 0]);
//     this.svg.append("g")
//       .call(d3.axisLeft(this.y));
// }

// public drawPlot() {

// }

// constructor(public http: HttpClient) {}
// ngOnInit() {

//   this.http.get(this.data_loc, { responseType: 'text' }).subscribe(data => {
//     const objs = d3.csvParse(data);

//     this.initSvg("#my_dataviz");
//     this.initAxis(objs);
//     this.drawPlot();

//     // Add dots
//     this.svg.append('g')
//       .selectAll("dot")
//       .data(objs)
//       .enter()
//       .append("circle")
//         .attr("cx", d => this.x(d.GrLivArea))
//         .attr("cy", d => this.y(d.SalePrice))
//         .attr("r", 5.0)
//         .style("fill", d => this.colorScale(d.label))
//         .on("mouseover", function(d) {
//             d3.select(this)
//             .attr("r", 20)
//             .attr("stroke", "black")
//             .attr("stroke-width", 3);
//         })
//         .on("mouseout", function(d) {
//             d3.select(this)
//             .attr("r", 5)
//             .attr("stroke-width", 0);
//         })
        
//   });
// }