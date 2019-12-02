import { Component, OnInit, ViewChild, Input, ElementRef, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

// https://bl.ocks.org/LemoNode/5a64865728c6059ed89388b5f83d6b67
// https://stackblitz.com/edit/angular-d3-v4-barchart
// https://observablehq.com/@d3/stacked-bar-chart

import file_list from '../../../Preprocessing/preprocessed/file_list.json';
import alb_esp1 from '../../../Preprocessing/preprocessed/data/alb_esp1.json';
import alb_esp2 from '../../../Preprocessing/preprocessed/data/alb_esp2.json';
import alb_esp3 from '../../../Preprocessing/preprocessed/data/alb_esp3.json';
import alb_esp4 from '../../../Preprocessing/preprocessed/data/alb_esp4.json';
import alb_esp5 from '../../../Preprocessing/preprocessed/data/alb_esp5.json';


import * as _ from 'lodash';

@Component({
  selector: 'app-seijun2',
  templateUrl: './seijun2.component.html',
  styleUrls: ['./seijun2.component.css']
})
export class Seijun2Component implements OnInit, AfterViewInit {

  @ViewChild('svgRef', {static: false}) svgRef: ElementRef;
  @Input() public data: Array<any> = [];
  public mold = alb_esp1;
  public pitch: Array<any> = [];
  public octave: Array<any> = [];
  public title = 'Stacked Bar Chart';
  public keys: Array<any> = [];
  public len: number;
  public files: Array<any> = [];
  public zz;

  private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;


  constructor() { }

  public generateList() {
    file_list.forEach(e => {
      this.files.push(e);
    });
  }

  // sort out unique pitches
  public generatePitchOctave() {
    this.mold.Notes.forEach(d => {
      if (this.pitch.indexOf(d.Note_pitch_class) === -1) {
        this.pitch.push(d.Note_pitch_class);
      }
      if (this.octave.indexOf(d.Note_octave) === -1) {
        this.octave.push(d.Note_octave);
      }
    });
  }

  public generateData() {
    // make subset (key: "Note_pitch_class", "Note_octave")
    let subsets: Array<any> = _.map(this.mold.Notes, function(e) {
      return _.pick(e, 'Note_pitch_class', 'Note_octave');
    });

    // add count key (key: "Note_pitch_class", "Note_octave", "count")
    subsets.forEach((d) => d.count = 1);

    // aggregate count by groups (Note_pitch_class & Note_octave)
    const result: any = Object.values(subsets.reduce(function(r, e) {
      const key = e.Note_pitch_class + '|' + e.Note_octave;
      if (!r[key]) {
        r[key] = e;
      } else {
        r[key].count += e.count;
      }
      return r;
    }, {}));

    // make new key
    result.forEach((d) => {
      d['Note_octave' + d.Note_octave] = d.count;
    });

    // exclude keys (key: "count", "Note_octave")
    subsets = _.map(result, function(e) {
      return _.omit(e, 'count', 'Note_octave');
    });

    // aggregate by key: "Note_pitch_class"
    let subsets_a = _.map(_.groupBy(subsets, 'Note_pitch_class'), (vals, id) => {
      return _.reduce(vals, (m, o) => {
        for (const p in o) {
          if (p != 'Note_pitch_class') {
            m[p] = (m[p] || 0) + o[p];
          }
        }
        return m;
      }, {Note_pitch_class: id});
    });

    // add Note_octave_i == 0  if it does not exist
    subsets_a.forEach((d) => {
      for (let i in this.octave) {
        if(d.hasOwnProperty('Note_octave' + this.octave[i])) continue;
        else d["Note_octave" + this.octave[i]] = 0;
      }
    });

    // rename key: 'Note_pitch_class'
    for (let obj of subsets_a) {
      obj['Class'] = obj.Note_pitch_class;
      delete obj.Note_pitch_class;
    }

    // JSON as array
    this.keys = Object.keys(subsets_a[0]).sort();
    this.len = Object.keys(subsets_a[0]).length;
    let tmp = [];

    // let sum: number = 0;
    subsets_a.forEach(e => {
      for(let i = 0 ; i < this.len; i++) {
        tmp.push(e[this.keys[i]]);
        // if(i > 0)
        //   sum += e[this.keys[i]];
      }
      // tmp.push(sum);
      this.data.push(tmp);
      tmp = [];
      // sum = 0;
      }
    );

    // add sum of octave
    // this.keys.push("Note_octave_sum")

    // make it as a stacked item
    let stack = d3.stack()
      .keys(this.keys.slice(1));
    this.data = stack(JSON.parse(JSON.stringify(subsets_a)));

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.generateList();
    this.generatePitchOctave();
    this.generateData();
    this.createChart();
    if (this.data) {
      this.updateChart();
    }
  }

  createChart() {
    let element: any = this.svgRef.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    let svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    // chart plot area
    this.chart = svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
      // .attr('class', 'bars')

    // define X & Y domains
    let xDomain: any = this.pitch.map(d => d);
    let yDomain: any = [0, d3.max(this.data, d => d3.max(d, d => d[1]))]; // MAX: 142
    // let yDomain: any = [0, d3.max(this.data, d => d[0])];

    // create scales
    this.xScale = d3.scaleBand()
      .domain(xDomain)
      .rangeRound([0, this.width])
      .padding(0.1);

    this.yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([this.height, 0]);

    // bar colors
    this.colors = d3.scaleOrdinal()
      .domain(this.data.map(d => d.key))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), this.data.length).reverse())
      .unknown('#ccc')

    // x & y axis
    this.xAxis = svg.append('g')
      .attr('class', 'axis-x')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(this.xScale));
    this.yAxis = svg.append('g')
      .attr('class', 'axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yScale));


    this.chart.selectAll('g')
      .data(this.data)
      .join('g')
        .attr('fill', d => this.colors(d.key))
      .selectAll('rect')
      .data(d => d)
      .join('rect')
        .attr('x', (d, i) => this.xScale(d.data.Class))
        .attr('y', d => this.yScale(d[1]))
        .attr('height', d => this.yScale(d[0]) - this.yScale(d[1]))
        .attr('width', this.xScale.bandwidth());

  }

  updateChart() {
    this.mold = alb_esp2;
    console.log('xxxx');
    console.log(this.mold);
    console.log(this.zz);

    // // update scales & axis
    this.xScale.domain(this.pitch.map(d => d));
    this.yScale.domain([0, d3.max(this.data, d => d3.max(d, d => d[1]))]);
    this.colors.domain(this.data.map(d => d.key));
    this.xAxis.transition().call(d3.axisBottom(this.xScale));
    this.yAxis.transition().call(d3.axisLeft(this.yScale));

    const update = this.chart.selectAll('g')
      .data(this.data);

    // remove exiting bars
    update.exit().remove();

    // update existing bars
    this.chart.selectAll('g')
      .transition()
      .attr('x', d => this.xScale(d.Class))
      .attr('y', d => this.yScale(d[1]))
      .attr('width', d => this.xScale.bandwidth())
      .attr('height', d => 120)
      // .attr('height', d => this.yScale(d[1]) - this.yScale(d[0]))
      .style('fill', (d, i) => this.colors(d.key));

    // add new bars
    update
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.xScale(d.Class))
      .attr('y', d => this.yScale(0))
      .attr('width', this.xScale.bandwidth())
      .attr('height', 0)
      .style('fill', (d, i) => this.colors(d.key))
      .transition()
      .delay((d, i) => i * 10)
      .attr('y', d => this.yScale(d[1]))
      .attr('height', d => 120);
      // .attr('height', d => this.yScale(d[1]) - this.yScale(d[0]));
  }
}






// import { Component, ViewEncapsulation, OnInit, ViewChild, Input, ElementRef, AfterViewInit } from '@angular/core';
// import * as d3 from 'd3';

// // https://bl.ocks.org/LemoNode/5a64865728c6059ed89388b5f83d6b67
// // https://stackblitz.com/edit/angular-d3-v4-barchart
// // https://observablehq.com/@d3/stacked-bar-chart

// import { STATISTICS } from '../shared';
// import alb_esp1 from  '../../../Preprocessing/preprocessed/data/alb_esp1.json';
// import * as _ from 'lodash';

// @Component({
//   selector: 'app-seijun2',
//   templateUrl: './seijun2.component.html',
//   styleUrls: ['./seijun2.component.css']
// })
// export class Seijun2Component implements OnInit, AfterViewInit {

//   @ViewChild('svgRef', {static: false}) svgRef: ElementRef;
//   @Input() public data: Array<any> = [];
//   public pitch: Array<any> = [];
//   public octave: Array<any> = [];
//   public title: string = 'Bar Chart';
//   public keys: Array<any> = [];
//   public len: number;

//   constructor() { }

//   // sort out unique pitches
//   public generatePitchOctave() {
//     alb_esp1.Notes.forEach(d => {
//       if (this.pitch.indexOf(d.Note_pitch_class) === -1) {
//         this.pitch.push(d.Note_pitch_class);
//       }
//       if (this.octave.indexOf(d.Note_octave) === -1) {
//         this.octave.push(d.Note_octave);
//       }
//     });
//   }

//   public generateData() {
//     // let xxx = JSON.stringify(arr);
//     // xxx = JSON.parse(xxx);
//     // console.log(xxx[0]["shape"]);
    
//     // make subset (key: "Note_pitch_class", "Note_octave")
//     let subsets: Array<any> = _.map(alb_esp1.Notes, function(e) {
//       return _.pick(e, 'Note_pitch_class', 'Note_octave');
//     });
    
//     // add count key (key: "Note_pitch_class", "Note_octave", "count")
//     subsets.forEach((d) => d["count"] = 1);
    
//     // aggregate count by groups (Note_pitch_class & Note_octave)
//     let result: any = Object.values(subsets.reduce(function(r, e) {
//       let key = e.Note_pitch_class + '|' + e.Note_octave;
//       if (!r[key]) r[key] = e;
//       else {
//         r[key].count += e.count;
//       }
//       return r;
//     }, {}))

//     // make new key    
//     result.forEach((d) => {
//       d["Note_octave" + d["Note_octave"]] = d["count"]
//     });

//     // exclude keys (key: "count", "Note_octave")
//     subsets = _.map(result, function(e) {
//       return _.omit(e, 'count', 'Note_octave');
//     });

//     // aggregate by key: "Note_pitch_class"
//     let subsets_a = _.map(_.groupBy(subsets, "Note_pitch_class"), function(vals, id) {
//       return _.reduce(vals, function(m, o) {
//         for (var p in o)
//           if (p != "Note_pitch_class")
//             m[p] = (m[p]||0) + o[p];
//         return m;
//       }, {Note_pitch_class: id});
//     });

//     // add Note_octave_i == 0  if it does not exist
//     subsets_a.forEach((d) => {
//       for (let i in this.octave) {
//         if(d.hasOwnProperty('Note_octave' + this.octave[i])) continue;
//         else d["Note_octave" + this.octave[i]] = 0;
//       }
//     });

    
    
//     // JSON as array
//     this.keys = Object.keys(subsets_a[0]).sort()
//     this.len = Object.keys(subsets_a[0]).length
//     let tmp = [];
//     // subsets_a.forEach((d: any) => [
//     //   this.data.push([d.Note_pitch_class, d.Note_octave4, d.Note_octave6])
//     //   this.data[d.Note_pitch_class] = (this.data[d.Note_pitch_class] + 1) || 1
//     // ]
//     // );
//     subsets_a.forEach(e => {
//       for(let i=0; i<this.len; i++)
//         tmp.push(e[this.keys[i]]);
//         this.data.push(tmp);
//         tmp = [];
//       }
//     );

//     // make it as a stacked item
//     let stack = d3.stack()
//       .keys(Object.keys(this.data[this.len-1]));
//     this.data = stack(this.data);

//     console.log(this.keys);
//     console.log(this.data);
//   }

//   ngOnInit() {
//   }

//   ngAfterViewInit() {
//     this.generatePitchOctave();
//     this.generateData();
//     this.createChart();
//     if (this.data) {
//       this.updateChart();
//     }
//   }

//   private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
//   private chart: any;
//   private width: number;
//   private height: number;
//   private xScale: any;
//   private yScale: any;
//   private colors: any;
//   private xAxis: any;
//   private yAxis: any;
 
//   createChart() {
//     let element: any = this.svgRef.nativeElement;
//     this.width = element.offsetWidth - this.margin.left - this.margin.right;
//     this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
//     let svg = d3.select(element).append('svg')
//       .attr('width', element.offsetWidth)
//       .attr('height', element.offsetHeight);

//     // chart plot area
//     this.chart = svg.append('g')
//       .attr('class', 'bars')
//       .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

//     // define X & Y domains
//     let xDomain: any = this.data.map(d => d[this.len-1]);
//     let yDomain: any = [0, d3.max(this.data, d => d[0])];

//     // create scales
//     this.xScale = d3.scaleBand()
//       .domain(xDomain)
//       .rangeRound([0, this.width])
//       .padding(0.1);

//       this.yScale = d3.scaleLinear()
//       .domain(yDomain)
//       .range([this.height, 0]);

//     // bar colors
//     this.colors = d3.scaleLinear()
//       .domain([0, this.data.length])
//       .range(<any[]>['red', 'blue']);

//     // x & y axis
//     this.xAxis = svg.append('g')
//       .attr('class', 'axis axis-x')
//       .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
//       .call(d3.axisBottom(this.xScale));
//     this.yAxis = svg.append('g')
//       .attr('class', 'axis axis-y')
//       .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
//       .call(d3.axisLeft(this.yScale));
//   }

//   updateChart() {
//     // update scales & axis
//     this.xScale.domain(this.data.map(d => d[this.len-1]));
//     this.yScale.domain([0, d3.max(this.data, d => d[0])]);
//     this.colors.domain([0, this.data.length]);
//     this.xAxis.transition().call(d3.axisBottom(this.xScale));
//     this.yAxis.transition().call(d3.axisLeft(this.yScale));

//     let update = this.chart.selectAll('.bar')
//       .data(this.data);

//     // remove exiting bars
//     update.exit().remove();

//     // update existing bars
//     this.chart.selectAll('.bar').transition()
//       .attr('x', d => this.xScale(d[this.len-1]))
//       .attr('y', d => this.yScale(d[0]))
//       .attr('width', d => this.xScale.bandwidth())
//       .attr('height', d => this.height - this.yScale(d[0]))
//       .style('fill', (d, i) => this.colors(i));

//     // add new bars
//     update
//       .enter()
//       .append('rect')
//       .attr('class', 'bar')
//       .attr('x', d => this.xScale(d[this.len-1]))
//       .attr('y', d => this.yScale(0))
//       .attr('width', this.xScale.bandwidth())
//       .attr('height', 0)
//       .style('fill', (d, i) => this.colors(i))
//       .transition()
//       .delay((d, i) => i * 10)
//       .attr('y', d => this.yScale(d[0]))
//       .attr('height', d => this.height - this.yScale(d[0]));
//   }
// }