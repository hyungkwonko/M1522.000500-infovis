import { Component, ViewEncapsulation, OnInit, ViewChild, Input, ElementRef, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

// https://bl.ocks.org/LemoNode/5a64865728c6059ed89388b5f83d6b67
// https://stackblitz.com/edit/angular-d3-v4-barchart

import { STATISTICS } from '../shared';
import alb_esp1 from  '../../../Preprocessing/preprocessed/data/alb_esp1.json';
import { ConnectedOverlayPositionChange } from '@angular/cdk/overlay';


@Component({
  selector: 'app-dongmoon',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dongmoon.component.html',
  styleUrls: ['./dongmoon.component.css']
})
export class DongmoonComponent implements OnInit, AfterViewInit {

  @ViewChild('svgRef', {static: false}) svgRef: ElementRef;
  @Input() public data: Array<any>;
  @Input() public data2: Array<any>;

  constructor() { }

  title: string = 'Bar Chart';
  
  // generateData() {
  //   this.data = [];
  //   for (let i = 0; i < (8 + Math.floor(Math.random() * 10)); i++) {
  //     this.data.push([
  //       `Index ${i}`,
  //       Math.floor(Math.random() * 100)
  //     ]);
  //   }
  //   console.log(this.data);
  // }

  public pitch: Array<any> = [];
  public octave: Array<any> = [];

  // sort out unique pitches
  public generatePitchOctave() {
    alb_esp1.Notes.forEach(d => {
      if (this.pitch.indexOf(d.Note_pitch_class) === -1) {
        this.pitch.push(d.Note_pitch_class);
      }
      if (this.octave.indexOf(d.Note_octave) === -1) {
        this.octave.push(d.Note_octave);
      }
    });
  }

  public generateData2() {
    this.data = [];

    // this.data = JSON.parse(alb_esp1.Notes)
    
    alb_esp1.Notes.forEach((d,i) =>
    // [
    //   this.data.push([d.Note_pitch_class, d.Note_octave, 1])
    //   this.data[d.Note_pitch_class] = (this.data[d.Note_pitch_class] + 1) || 1
    // ]
      console.log(d.Note_pitch_class)
      
    );
    console.log(this.data);
    console.log(alb_esp1);

    let arr =[{"shape":"square","color":"red","instances":1},
    {"shape":"square","color":"red","instances":1},
    {"shape":"circle","color":"blue","instances":0},
    {"shape":"square","color":"blue","instances":4},
    {"shape":"circle","color":"red","instances":1},
    {"shape":"circle","color":"red","instances":0},
    {"shape":"square","color":"blue","instances":5},
    {"shape":"square","color":"red","instances":1}]

    let result = Object.values(arr.reduce(function(r, e) {
      let key = e.shape + '|' + e.color;
      if (!r[key]) r[key] = e;
      else {
        r[key].instances += e.instances
      }
      return r;
    }, {}))
    
    console.log(result)

    
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.generatePitchOctave();
    // console.log(this.pitch);
    // console.log(this.octave);
    
    // this.generateData();
    this.generateData2();

    // this.data = [];
    // STATISTICS.forEach((d, i) => {
    //   this.data.push([
    //     d.letter,
    //     d.frequency
    //   ]);
    // });

    
    
    
    this.createChart();
    if (this.data) {
      this.updateChart();
    }
  }

  private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;
 
  createChart() {
    let element: any = this.svgRef.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    let svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    // chart plot area
    this.chart = svg.append('g')
      .attr('class', 'bars')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // define X & Y domains
    let xDomain: any = this.data.map(d => d[0]);
    let yDomain: any = [0, d3.max(this.data, d => d[1])];

    // create scales
    this.xScale = d3.scaleBand().padding(0.1).domain(xDomain).rangeRound([0, this.width]);
    this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);

    // bar colors
    this.colors = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>['red', 'blue']);

    // x & y axis
    this.xAxis = svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(this.xScale));
    this.yAxis = svg.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yScale));

      console.log(this.xAxis);


  }

  updateChart() {
    // update scales & axis
    this.xScale.domain(this.data.map(d => d[0]));
    this.yScale.domain([0, d3.max(this.data, d => d[1])]);
    this.colors.domain([0, this.data.length]);
    this.xAxis.transition().call(d3.axisBottom(this.xScale));
    this.yAxis.transition().call(d3.axisLeft(this.yScale));

    let update = this.chart.selectAll('.bar')
      .data(this.data);

    // remove exiting bars
    update.exit().remove();

    // update existing bars
    this.chart.selectAll('.bar').transition()
      .attr('x', d => this.xScale(d[0]))
      .attr('y', d => this.yScale(d[1]))
      .attr('width', d => this.xScale.bandwidth())
      .attr('height', d => this.height - this.yScale(d[1]))
      .style('fill', (d, i) => this.colors(i));

    // add new bars
    update
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.xScale(d[0]))
      .attr('y', d => this.yScale(0))
      .attr('width', this.xScale.bandwidth())
      .attr('height', 0)
      .style('fill', (d, i) => this.colors(i))
      .transition()
      .delay((d, i) => i * 10)
      .attr('y', d => this.yScale(d[1]))
      .attr('height', d => this.height - this.yScale(d[1]));
  }
}