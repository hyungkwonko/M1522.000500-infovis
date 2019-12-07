import { IMusic } from './../music';
import { Component, OnInit, ViewChild, Input, ElementRef, AfterViewInit} from '@angular/core';
import * as d3 from 'd3';

import file_list from '../../../Preprocessing/preprocessed/file_list.json';
import alb_esp1 from '../../../Preprocessing/preprocessed/data/alb_esp1.json';

import * as _ from 'lodash';

@Component({
  selector: 'app-seijun',
  templateUrl: './seijun.component.html',
  styleUrls: ['./seijun.component.css']
})
export class SeijunComponent implements OnInit, AfterViewInit {

  @ViewChild('svgRef2', {static: false}) svgRef2: ElementRef;
  @ViewChild('svgRef3', {static: false}) svgRef3: ElementRef;
  @Input() public mold: IMusic;
  // public data: Object = {};
  public dataset_n3: Array<any> = [];
  public dataset_n4: Array<any> = [];
  public dataset_n6: Array<any> = [];
  public dataset_n7: Array<any> = [];
  public return_data_v: Array<any> = [0];
  public return_data_p: Array<any> = [0];
  public pitch: Array<any> = [];
  public octave: Array<any> = [];
  public title = '3,4,6,7 Charts';
  public keys: Array<any> = [];
  public pitch_domain: Array<any> = ['C', 'C#', 'D', 'D#','E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  public color: Array<any> = ["#77D977", "#A877D9", "#D9D977", "#77A8D9", "#D97777", "#77D9A8", "#D977D9", "#A8D977", "#7777D9", "#D9A877", "#77D9D9", "#D977A8"];
  public bar_color_domain: Array<any> = [
        {'r' : 217, 'g' :168, 'b' :119}, {'r' :119, 'g' :217, 'b' :217}, {'r' :217, 'g' :119, 'b' :168}
      , {'r' :119, 'g' :217, 'b' :119}, {'r' :168, 'g' :119, 'b' :217}, {'r' :217, 'g' :217, 'b' :119}
      , {'r' :119, 'g' :168, 'b' :217}, {'r' :217, 'g' :119, 'b' :119}, {'r' :119, 'g' :217, 'b' :168}
      , {'r' :217, 'g' :119, 'b' :217}, {'r' :168, 'g' :217, 'b' :119}, {'r' :119, 'g' :119, 'b' :217}
      ];

  private margin: any = { top: 30, bottom: 20, left: 30, right: 10, mid: 10};
  private chart: any;
  private width: number;
  private elements_height: number = 10;
  private barPadding: number = 0.2;
  private barWidth_3: number;
  private barWidth_4: number;
  private height: number ;
  private xScale_3: any;
  private yScale_3: any;
  private xScale_4: any;
  private yScale_4: any;
  private xScale_6: any;
  private yScale_6: any;
  private xScale_7: any;
  private yScale_7: any;
  private colors: any;
  private xAxis_3: any;
  private xAxis_4: any;
  private yAxis_3: any;
  private yAxis_4: any;
  private xAxis_6: any;
  private yAxis_6: any;
  private xAxis_7: any;
  private yAxis_7: any;

  private chart_3: any;
  private chart_4: any;

  private start_n3: boolean = true;


  // Helper Variables
      
  
  // initialize that data
  public selected_data: Array<any> = [ {"ID" : "" } ]; // Hover, Click, Drag 등으로 선택된 Data들
  public note_on_off_pair: Array<any> = [];

  public getAllIndexes_v = function(object, value){
    let indexes = [];
    for (let i = 0; i < object.length; i++) {
      if (object[i].Note_velocity === value) {
        indexes.push(i);
      }
    }
    return indexes;
  };

  public getAllIndexes_p = function(object, value){
    let indexes = [];
    for (let i = 0; i < object.length; i++) {
      if (object[i].Note_position === value) {
        indexes.push(i);
      }
    }
    return indexes;
  };
  
  public RGBtoHSV = function(rgb) {
    let r = rgb.r;
    let g = rgb.g;
    let b = rgb.b;
    r /= 255, g /= 255, b /= 255;
    
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
    let d = max - min;
    s = max == 0 ? 0 : d / max;
    
    if (max == min) {
      h = 0; // achromatic
      } 
    else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
        }
    return [ h, s, v ];
  };

  public generateData() {
    this.note_on_off_pair = [];
    this.return_data_v = [0];
    this.return_data_p = [0];
    this.dataset_n3 = [];
    this.dataset_n4 = [];
    this.dataset_n6 = [];
    this.dataset_n7 = [];

    for (let i = 0; i < this.mold.Notes.length; i++) {
      if (this.mold.Notes[i].Note_velocity > 0) {
          this.note_on_off_pair.push(
          {
            "Note_velocity": this.mold.Notes[i].Note_velocity,
            "Note_position": this.mold.Notes[i].Note_position,
            "val_x": this.mold.Notes[i].Start_timing,
            "val_y": this.mold.Notes[i].Note_position + this.elements_height/2,
            "pitch_class": this.mold.Notes[i].Note_pitch_class,
            "ID": this.mold.Notes[i].ID
          }
        )
      }
    };

    for (let j = 1; j < 128; j++) {
      this.return_data_v.push(this.getAllIndexes_v(this.note_on_off_pair, j));
      this.return_data_p.push(this.getAllIndexes_p(this.note_on_off_pair, j));
    };

    for (let i = 1; i < 128; i++) {
      this.dataset_n3.push(
        {
          "n_Note_velocity" : this.return_data_v[i].length, // y_val
          "Note_velocity" : i // x_val
        }
      );
      this.dataset_n4.push(
        {
          "n_Note_position" : this.return_data_p[i].length, // y_val
          "Note_position" : i, // x_val
          // "color": that.RGBtoHSV(bar_color_domain[i%12])
          'color': this.color[i%12]
        }
      );
    };

    for (let i = 0; i < this.mold.Notes.length; i++) {
      if (this.mold.Notes[i].Note_velocity > 0) {
        this.dataset_n6.push(
          {
            "ID": this.mold.Notes[i].ID,
            "class": String(this.mold.Notes[i].ID),
            "val_x": this.mold.Notes[i].Start_timing,
            "val_y": this.mold.Notes[i].Note_position + this.elements_height/2,
            "pitch_class": this.mold.Notes[i].Note_pitch_class,
            'color': this.color[parseInt(this.mold.Notes[i].Note_position)%12],
            "Timing_Difference": this.mold.Notes[i].End_timing - this.mold.Notes[i].Start_timing
          }
        );
        this.dataset_n7.push(
          {
            "ID": this.mold.Notes[i].ID,
            "class": String(this.mold.Notes[i].ID),
            "val_x": this.mold.Notes[i].Start_timing,
            "val_y": this.mold.Notes[i].Note_velocity,
          }
        );
      }
    };
  }

  constructor() {}

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes) {
    if (changes.mold.currentValue.Filename) {
      this.generateData();
      if(this.start_n3) {
        this.createChart3();
        this.createChart4();
        this.start_n3 = false;
      }
      if (this.dataset_n3 && this.dataset_n4) {
        this.updateChart3();
        this.updateChart4();
      }
    }
  }

  createChart3() {
    let element: any = this.svgRef2.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    this.barWidth_3 = this.width / this.dataset_n3.length;
    
    let svg_3 = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight)
    
    this.chart_3 = svg_3.append('g')
      .attr('class', 'bars3')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    
    // define X & Y domains
    this.xScale_3 = d3.scaleLinear()
      .domain([d3.min(this.dataset_n3, d => d.Note_velocity), d3.max(this.dataset_n3, d => d.Note_velocity)])
      .range([0, this.width]);

    this.yScale_3 = d3.scaleLinear()
      .domain([d3.min(this.dataset_n3, d => d.n_Note_velocity), d3.max(this.dataset_n3, d => d.n_Note_velocity)])
      .range([this.height, 0]);

    this.xAxis_3 = svg_3.append('g')
      .attr('class', 'xAxis3')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(this.xScale_3));

    this.yAxis_3 = svg_3.append('g')
      .attr('class', 'yAxis3')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yScale_3));

    }

  createChart4() {
    let element: any = this.svgRef3.nativeElement;
    this.barWidth_4 = this.width / this.dataset_n4.length;

    let svg_4 = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight)

    this.chart_4 = svg_4.append('g')
    .attr('class', 'bars4')
    .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    //define X & Y domains || create scales
    this.xScale_4 = d3.scaleLinear()
    .domain([d3.min(this.dataset_n4, d => d.Note_position), d3.max(this.dataset_n4, d => d.Note_position)])
    .range([0, this.width]);

    this.yScale_4 = d3.scaleLinear()
    .domain([d3.min(this.dataset_n4, d => d.n_Note_position), d3.max(this.dataset_n4, d => d.n_Note_position)])
    .range([this.height, 0]);

    // x & y Axis
    this.xAxis_4 = svg_4.append('g')
      .attr('class', 'xAxis4')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(this.xScale_4))
    
    this.yAxis_4 = svg_4.append('g')
      .attr('class', 'yAxis4')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yScale_4));
  }
    
  updateChart3() {
    this.xScale_3.domain(
      [d3.min(this.dataset_n3, d => d.Note_velocity), d3.max(this.dataset_n3, d => d.Note_velocity)]
    );
    this.yScale_3.domain(
      [d3.min(this.dataset_n3, d => d.n_Note_velocity), d3.max(this.dataset_n3, d => d.n_Note_velocity)]
    );
    this.xAxis_3.transition().call(d3.axisBottom(this.xScale_3));
    this.yAxis_3.transition().call(d3.axisLeft(this.yScale_3));

    let update3 = this.chart_3.selectAll('.bar3')
      .data(this.dataset_n3);

    // remove exiting bars
    update3.exit().remove();

    // update3 existing bars
    this.chart_3.selectAll('.bar3').transition()
      .attr("width", this.barWidth_3 - this.barPadding)
      .attr("height", (d, i) => this.height*(d.n_Note_velocity)/d3.max(this.dataset_n3, d => d.n_Note_velocity))
      .attr('x', (d, i) => this.xScale_3(d.Note_velocity))
      .attr('y', (d, i) => this.height - this.height*(d.n_Note_velocity)/d3.max(this.dataset_n3, d => d.n_Note_velocity));

    // add new bars
    update3
      .enter()
      .append('rect')
      .attr('class', 'bar3')
      .attr("width", this.barWidth_3 - this.barPadding)
      .attr('x', (d, i) => this.xScale_3(d.Note_velocity))
      .attr('y', d => this.yScale_3(0))
      .attr('height', 0)
      .transition()
      .delay((d, i) => i * 5)
      .attr('y', (d, i) => this.height - this.height*(d.n_Note_velocity)/d3.max(this.dataset_n3, d => d.n_Note_velocity))
      .attr("height", (d, i) => this.height*(d.n_Note_velocity)/d3.max(this.dataset_n3, d => d.n_Note_velocity));

    // hover over mouse
    this.chart_3
      .selectAll('.bar3')
      .on('mouseover', function (d, i) {
        d3.select(this)
          .attr('fill', 'red')
        // .attr('stroke-width', "2px")
        // console.log("this: ");
        // console.log(this);
      })
      .on('mouseout', function (d, i) {
        d3.select(this)
          .attr('fill', 'black')
        // .attr('stroke-width', "0.2px")
      })
      .on('mousedown', function (d, i) {
        console.log("zlzlzl");
            const brush = d3
              .brush()
              .extent([ [0,0], [400,400] ]);
        
      })
  }

  updateChart4() {
    this.xScale_4.domain([d3.min(this.dataset_n4, d => d.Note_position), d3.max(this.dataset_n4, d => d.Note_position)]);
    this.yScale_4.domain([d3.min(this.dataset_n4, d => d.n_Note_position), d3.max(this.dataset_n4, d => d.n_Note_position)]);
    this.xAxis_4.transition().call(d3.axisBottom(this.xScale_4));
    this.yAxis_4.transition().call(d3.axisLeft(this.yScale_4));

    let update4 = this.chart_4.selectAll('.bar4')
    .data(this.dataset_n4);

    // remove existing bars

    update4.exit().remove();

    this.chart_4.selectAll('.bar4').transition()
    .attr('x', d => this.xScale_4(d.Note_position))
    .attr('y', d => this.height - this.height*(d.n_Note_position)/d3.max(this.dataset_n4, d => d.n_Note_position))
    .attr('width', this.barWidth_4 - this.barPadding)
    .attr('height', (d, i) => this.height*(d.n_Note_position)/d3.max(this.dataset_n4, d => d.n_Note_position))
    .style('fill', d => d.color)

    // remove existing bars
    update4
      .enter()
      .append('rect')
      .attr('class', 'bar4')
      .attr('x', d => this.xScale_4(d.Note_position))
      .attr('width', this.barWidth_4 - this.barPadding)
      .style('fill', d => d.color)
      .transition()
      .attr('y', d => this.height - this.height*(d.n_Note_position)/d3.max(this.dataset_n4, d => d.n_Note_position))
      .attr('height', (d, i) => this.height*(d.n_Note_position)/d3.max(this.dataset_n4, d => d.n_Note_position))

    // hover over mouse
    this.chart_4
      .selectAll('.bar4')
      .on('mouseover', function (d, i) {
        d3.select(this)
          .style('fill', 'red')
      })
      .on('mouseout', function (d, i) {
        d3.select(this)
          .style('fill', d.color)
      })
  }

}