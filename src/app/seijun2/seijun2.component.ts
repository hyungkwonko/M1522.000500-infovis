import { IMusic } from './../music';
import { Component, OnInit, ViewChild, Input, ElementRef, AfterViewInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

// https://bl.ocks.org/LemoNode/5a64865728c6059ed89388b5f83d6b67
// https://stackblitz.com/edit/angular-d3-v4-barchart
// https://observablehq.com/@d3/stacked-bar-chart

import file_list from '../../../Preprocessing/preprocessed/file_list.json';
import alb_esp1 from '../../../Preprocessing/preprocessed/data/alb_esp1.json';

import * as _ from 'lodash';

@Component({
  selector: 'app-seijun2',
  templateUrl: './seijun2.component.html',
  styleUrls: ['./seijun2.component.css']
})
export class Seijun2Component implements OnInit, AfterViewInit {

  @ViewChild('svgRef', {static: false}) svgRef: ElementRef;
  @Input() public mold: IMusic;
  public data: Array<any> = [];
  public pitch: Array<any> = [];
  public pitchCount: any;
  public octave: Array<any> = [];
  public title = 'Note pitch class distribution';
  public key = '';
  public keys: Array<any> = [];
  public len: number;
  public files: Array<any> = [];
  private margin: any = { top: 20, bottom: 20, left: 30, right: 30};
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;
  public sorts: Array<any> = ['default', 'ascending', 'descending'];
  public opt: string = this.sorts[0];
  public start: boolean = true;

  constructor() { }

  // public generateList() {
  //   file_list.forEach(e => {
  //     this.files.push(e);
  //   });
  // }

  public getPitchOrder($event: string) {
    // change setting to the previous one if it is a function (not allocated) 
    if(typeof($event) != 'function') {
      this.opt = $event;
    }
    
    let result = [];
    for (let i = 0; i < this.pitch.length; i++) {
      result.push([this.pitch[i], this.pitchCount[i]])
    }

    if (this.opt == 'default') {
      result.sort(function(a, b) {
        let aIsAlphabetical = a[0].localeCompare("C") >= 0,
            bIsAlphabetical = b[0].localeCompare("C") >= 0;
        if (!aIsAlphabetical && bIsAlphabetical)
            return 1;
        if (aIsAlphabetical && !bIsAlphabetical)
            return -1;
        return a[0].localeCompare(b[0]);
      });
    } else if (this.opt == "ascending") {
      result.sort((a, b) => a[1] - b[1]);
    } else {
      result.sort((a, b) => b[1] - a[1]);
    };
    this.pitch = [];
    this.pitchCount = [];
    result.forEach(e => {
      this.pitch.push(e[0])
      this.pitchCount.push(e[1])
    });
  }

  // sort out unique pitches
  public generatePitchOctave() {
    this.pitch = [];
    this.octave = [];
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
    let sum = 0;
    this.pitchCount = [];

    // let sum: number = 0;
    subsets_a.forEach(e => {
      for(let i = 0 ; i < this.len; i++) {
        tmp.push(e[this.keys[i]]);
        if(i > 0)
          sum += e[this.keys[i]];
        }
      this.pitchCount.push(sum)
      // tmp.push(sum);
      this.data.push(tmp);
      tmp = [];
      sum = 0;
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
    // this.mold = alb_esp1;
    // this.generateList();
    // this.generatePitchOctave();
    // this.generateData();
    // this.createChart();
    // if (this.data) {
    //   this.updateChart();
    // }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.mold.isFirstChange()) {
      this.generatePitchOctave();
      this.generateData();

      if(this.start) {
        this.createChart();
        this.start = false;
      }
      if (this.data) {
        this.updateChart();
      }
      this.sortChart(Event);
      this.key = '(Key may be ' + this.findKeyFromDistribution() + '.)';
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
      .attr('class', 'bars')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // define X & Y domains
    let xDomain: any = this.pitch.map(d => d);
    let yDomain: any = [0, d3.max(this.data, d => d3.max(d, d => d[1]))]; // MAX: 142

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
      .unknown('#ccc');

    // color = ["#77D977", "#A877D9", "#D9D977", "#77A8D9", "#D97777", "#77D9A8", "#D977D9", "#A8D977", "#7777D9", "#D9A877", "#77D9D9", "#D977A8"];
    // pitch_domain = ['C', 'C#', 'D', 'D#','E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    // x & y axis
    this.xAxis = svg.append('g')
      .attr('class', 'axis-x')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(this.xScale));
    this.yAxis = svg.append('g')
      .attr('class', 'axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yScale));
  }

  updateChart() {
    // update scales & axis
    this.xScale.domain(this.pitch.map(d => d));
    this.yScale.domain([0, d3.max(this.data, d => d3.max(d, d => d[1]))]);
    this.colors.domain(this.data.map(d => d.key));
    this.xAxis.transition().call(d3.axisBottom(this.xScale));
    this.yAxis.transition().call(d3.axisLeft(this.yScale));
    
    // remove existing data
    let update = this.chart.selectAll('g')
      .data(this.data)
    update.exit().remove();

    // update chart
    update.join('g')
      .attr('fill', d => this.colors(d.key))
      .selectAll('rect')
      .data(d => d)
      .join('rect')
      .attr("stroke", "grey")
      .attr('width', this.xScale.bandwidth())
      .attr('height', d => this.yScale(d[0]) - this.yScale(d[1]))
      .transition()
      .delay((d, i) => i * 30)
        .attr('y', d => this.yScale(d[1]))
        .attr('x', (d, i) => this.xScale(d.data.Class))
        .ease(d3.easeLinear);
    
    // hover over mouse
    update.join('g')
      .attr('fill', d => this.colors(d.key))
      .selectAll('rect')
      .data(d => d)
      .join('rect')
      .on('mouseover', function (d, i) {
          d3.select(this)
            .attr('stroke', 'red')
            .attr('stroke-width', "2px");
      })
      .on('mouseout', function (d, i) {
          d3.select(this)
            .attr('stroke', 'grey')
            .attr('stroke-width', "1px");
      });
  }

  sortChart(opt) {
    this.getPitchOrder(opt)
    this.updateChart();
  }

  findKeyFromDistribution() {
    // http://rnhart.net/articles/key-finding/
    let notes = this.mold.Notes;
    let pitchClassDistribution = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];  // pitchClassDistribution[0] is C.
    notes.forEach(element => {
      pitchClassDistribution[element.Note_position % 12] += element.End_timing - element.Start_timing;
    });

    let majorProfile = [
      [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88], // C major
      [2.88, 6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29], // C# major
      [2.29, 2.88, 6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66], // D major
      [3.66, 2.29, 2.88, 6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39], // D# major
      [2.39, 3.66, 2.29, 2.88, 6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19], // E major
      [5.19, 2.39, 3.66, 2.29, 2.88, 6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52], // F major
      [2.52, 5.19, 2.39, 3.66, 2.29, 2.88, 6.35, 2.23, 3.48, 2.33, 4.38, 4.09], // F# major
      [4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88, 6.35, 2.23, 3.48, 2.33, 4.38], // G major
      [4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88, 6.35, 2.23, 3.48, 2.33], // G# major
      [2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88, 6.35, 2.23, 3.48], // A major
      [3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88, 6.35, 2.23], // A# major
      [2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88, 6.35], // B major
    ];
    let minorProfile = [
      [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17], // C minor
      [3.17, 6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34], // C# minor
      [3.34, 3.17, 6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69], // D minor
      [2.69, 3.34, 3.17, 6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98], // D# minor
      [3.98, 2.69, 3.34, 3.17, 6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75], // E minor
      [4.75, 3.98, 2.69, 3.34, 3.17, 6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54], // F minor
      [2.54, 4.75, 3.98, 2.69, 3.34, 3.17, 6.33, 2.68, 3.52, 5.38, 2.60, 3.53], // F# minor
      [3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17, 6.33, 2.68, 3.52, 5.38, 2.60], // G minor
      [2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17, 6.33, 2.68, 3.52, 5.38], // G# minor
      [5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17, 6.33, 2.68, 3.52], // A minor
      [3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17, 6.33, 2.68], // A# minor
      [2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17, 6.33], // B minor
    ];

    // https://stackoverflow.com/questions/15886527/javascript-library-for-pearson-and-or-spearman-correlations
    const pcorr = (x: number[], y: number[]) => {
      let sumX = 0,
        sumY = 0,
        sumXY = 0,
        sumX2 = 0,
        sumY2 = 0;
      const minLength = x.length = y.length = Math.min(x.length, y.length),
        reduce = (xi, idx) => {
          const yi = y[idx];
          sumX += xi;
          sumY += yi;
          sumXY += xi * yi;
          sumX2 += xi * xi;
          sumY2 += yi * yi;
        }
      x.forEach(reduce);
      return (minLength * sumXY - sumX * sumY) / Math.sqrt((minLength * sumX2 - sumX * sumX) * (minLength * sumY2 - sumY * sumY));
    };

    const pitchName = (pitch: number) => {
      let switcher = {
        0: 'C',
        1: 'C#',
        2: 'D',
        3: 'D#',
        4: 'E',
        5: 'F',
        6: 'F#',
        7: 'G',
        8: 'G#',
        9: 'A',
        10: 'A#',
        11: 'B'
      };
      return switcher[pitch.toString()];
    }

    let result = '';
    let maxCorr = -1;
    for (let i = 0; i < 12; i++) {
      let majorCorr = pcorr(majorProfile[i], pitchClassDistribution);
      if (maxCorr < majorCorr) {
        result = pitchName(i) + ' major';
        maxCorr = majorCorr;
      }
      let minorCorr = pcorr(minorProfile[i], pitchClassDistribution);
      if (maxCorr < minorCorr) {
        result = pitchName(i) + ' minor';
        maxCorr = minorCorr;
      }
    }
    console.log(maxCorr);
    return result;
  }
}

// let update = this.chart.selectAll('g')
// .data(this.data)
// // .join('g')
// // .selectAll('rect')
// // .data(d => d);

// // remove exiting bars
// update.exit().remove();

// // update existing bars
// this.chart.selectAll('g')
// .data(this.data)
// .join('g')
// .attr('fill', d => this.colors(d.key))
// // .style('opacity', (d,i) => {
// //     return 1 - i * 0.08;
// //   })
// .selectAll('rect')
// .data(d => d)
// .join('rect')
// // .transition()
// // .duration(0)
// .attr('x', (d, i) => this.xScale(d.data.Class))
// .attr('y', d => this.yScale(d[1]))
// .attr('height', d => this.yScale(d[0]) - this.yScale(d[1]))
// .attr('width', this.xScale.bandwidth())
// .attr("stroke", "grey");

// this.chart.selectAll('g')
// .data(this.data)
// .join('g')
//   .attr('fill', d => this.colors(d.key))
// .selectAll('rect')
// .data(d => d)
// .join('rect')
//   .on('mouseover', function (d, i) {
//       d3.select(this)
//       .transition()
//       .duration(30)
//         .attr('stroke', 'red')
//         .attr('stroke-width', "2px")
//   })
//   .on('mouseout', function (d, i) {
//       d3.select(this)
//         .transition()
//         .duration(30)
//         .attr('stroke', 'grey')
//         .attr('stroke-width', "1px")
//   });