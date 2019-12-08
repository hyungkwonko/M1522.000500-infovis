import { IMusic } from './../music';
import { Component, OnInit, ViewChild, Input, ElementRef, AfterViewInit, SimpleChanges} from '@angular/core';
import * as d3 from 'd3';

import * as _ from 'lodash';

@Component({
  selector: 'app-seijun',
  templateUrl: './seijun.component.html',
  styleUrls: ['./seijun.component.css']
})
export class SeijunComponent implements OnInit, AfterViewInit {

  @ViewChild('svgRef2', {static: false}) svgRef2: ElementRef;
  @ViewChild('svgRef3', {static: false}) svgRef3: ElementRef;
  @ViewChild('svgRef4', {static: false}) svgRef4: ElementRef;
  @ViewChild('svgRef5', {static: false}) svgRef5: ElementRef;
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
  private barPadding_7: number = 0.01;
  private barWidth_3: number;
  private barWidth_4: number;
  private barWidth_7: number;
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
  private chart_6: any;
  private chart_7: any;

  private start_drawing: boolean = true;

  private width_6: number;
  private height_6: number;
  private width_7: number;
  private height_7: number;



  // Helper Variables
      
  
  // initialize that data
  public selected_data: Array<any> = [ {"ID" : "" } ]; // Hover, Click, Drag 등으로 선택된 Data들
  public note_on_off_pair: Array<any> = [];

  public getAllIndexes_v = function(object, value){
    let indexes = [];
    for (let i = 0; i < object.length; i++) {
      if (object[i].Note_velocity === value) {
        // indexes.push(i);
        indexes.push(object[i].ID);
      }
    }
    return indexes;
  };

  public getAllIndexes_p = function(object, value){
    let indexes = [];
    for (let i = 0; i < object.length; i++) {
      if (object[i].Note_position === value) {
        // indexes.push(i);
        indexes.push(object[i].ID);
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
    this.return_data_v = [Array(0)];
    this.return_data_p = [Array(0)];
    this.dataset_n3 = [];
    this.dataset_n4 = [];
    this.dataset_n6 = [];
    this.dataset_n7 = [];

    for (let i = 0; i < this.mold.Notes.length; i++) { // this.mold.Notes.length
      if (this.mold.Notes[i].Note_velocity > 0) {
          this.note_on_off_pair.push(
          {
            "Note_velocity": this.mold.Notes[i].Note_velocity,
            "Note_position": this.mold.Notes[i].Note_position,
            "val_x": this.mold.Notes[i].Start_timing,
            "val_y": this.mold.Notes[i].Note_position + this.elements_height/2,
            "pitch_class": this.mold.Notes[i].Note_pitch_class,
            "ID": this.mold.Notes[i].ID,
            "State": this.mold.Notes[i].State
          }
        )
      }
    };
    
    for (let j = 1; j < 128; j++) {
      this.return_data_v.push(this.getAllIndexes_v(this.note_on_off_pair, j));
      this.return_data_p.push(this.getAllIndexes_p(this.note_on_off_pair, j));
    };

    for (let i = 0; i < 128; i++) {
      this.dataset_n3.push(
        {
          "n_Note_velocity" : this.return_data_v[i].length, // y_val
          "Note_velocity" : i, // x_val
          "Note_IDs": this.return_data_v[i]
        }
      );
      this.dataset_n4.push(
        {
          "n_Note_position" : this.return_data_p[i].length, // y_val
          "Note_position" : i, // x_val
          // "color": that.RGBtoHSV(bar_color_domain[i%12])
          'color': this.color[i%12],
          "Note_IDs": this.return_data_p[i]
        }
      );
    };
    
    this.dataset_n6.push(
      {
        "val_x": 0,
        "val_y": 127,
        "pitch_class": 0,
        'color': 'yellow',
        "Timing_Difference": 1000
      }
    );
    this.dataset_n7.push(
      {
        "val_x": 0,
        "val_y": 127,
        "pitch_class": 0,
        'color': 'yellow',
        "Timing_Difference": 1000
      }
    );

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
            "Timing_Difference": this.mold.Notes[i].End_timing - this.mold.Notes[i].Start_timing,
            "State": this.mold.Notes[i].State
          }
        );
        this.dataset_n7.push(
          {
            "ID": this.mold.Notes[i].ID,
            "class": String(this.mold.Notes[i].ID),
            "val_x": this.mold.Notes[i].Start_timing,
            "val_y": this.mold.Notes[i].Note_velocity,
            "State": this.mold.Notes[i].State
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

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.mold.isFirstChange()) {
      this.generateData();
      
      if(this.start_drawing) {
        this.createChart3();
        this.createChart4();
        this.createChart6();
        this.createChart7();
        this.start_drawing = false;
      }
      if (this.dataset_n3 && this.dataset_n4 && this.dataset_n6 && this.dataset_n7) {
        this.updateChart3();
        this.updateChart4();
        this.updateChart6();
        this.updateChart7();
      }
    }
  }

  set_hovered(d, i) {
    d3.select('#bars3_' + i)
      .style('stroke', 'blue')
      .style('stroke-width', '2');

    d3.select('#bars4_' + i)
      .style('stroke', 'red')
      .style('stroke-width', '2');

    d3.select('#bars6_' + i)
      .style('stroke', 'black')
      .style('stroke-width', '2');

    d3.select('#bars7_' + i)
      .style('stroke', 'black')
      .style('stroke-width', '2');

    d.State.hovered = true;
    // console.log(d);
    // console.log(d.State);
  }

  free_hovered(d, i) {
    d3.select('#bars3_' + i)
      .style('stroke-width', '0');

    d3.select('#bars4_' + i)
      .style('stroke-width', '0');

    d3.select('#bars6_' + i)
      .style('stroke', 'black')
      .style('stroke-width', '0');

    d3.select('#bars7_' + i)
      .style('stroke', 'black')
      .style('stroke-width', '0');
    
    d.State.hovered = false;
    // console.log(d);
    // console.log(d.State);
  }

  chart_hovered_6(d) {
// 빨간색 : #FF0000 => (255, 0,0 )
// 어두운 빨간색 : #8B0000 => (139, 0, 0)
// 보라색 : #EE82EE => (238, 130, 238)
// 어두운 보라색 : #9400D3 => (148, 0, 211)

    if (d.State.hovered === false) {
      return d.color;
    } else {
      return '#8B0000';
    }

  }

  chart_hovered_7(d) {
    // 빨간색 : #FF0000 => (255, 0,0 )
    // 어두운 빨간색 : #8B0000 => (139, 0, 0)
    // 보라색 : #EE82EE => (238, 130, 238)
    // 어두운 보라색 : #9400D3 => (148, 0, 211)
    
    if (d.State.hovered === false) {
      return "black";
    } else {
      return '#8B0000';
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

  createChart6() {
    let element: any = this.svgRef4.nativeElement;
    this.width_6 = element.offsetWidth - this.margin.left - this.margin.right;
    this.height_6 = element.offsetHeight - this.margin.top - this.margin.bottom;


    let svg_6 = d3.select(element)
    .append('svg')
    .attr('width', element.offsetWidth)
    .attr('height', element.offsetHeight);

    this.chart_6 = svg_6
    .append('g')
    .attr('class', 'scatter')
    .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    this.xScale_6 = d3.scaleLinear()
    .domain([d3.min(this.dataset_n6, d => d.val_x), d3.max(this.dataset_n6, d => d.val_x)])
    .range([0, this.width_6]);

    this.yScale_6 = d3.scaleLinear()
    .domain([0, 127])
    .range([this.height_6, 0]);

    // x&y axis
    this.xAxis_6 = svg_6
    .append('g')
    .attr('class', 'xAxis6')
    .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height_6})`)
    .call(d3.axisBottom(this.xScale_6));

    this.yAxis_6 = svg_6
    .append('g')
    .attr('class', 'yAxis6')
    .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
    .call(d3.axisLeft(this.yScale_6));

  }

  createChart7() {
    let element: any = this.svgRef5.nativeElement;
    this.barWidth_7 = this.width / this.dataset_n7.length;

    this.width_7 = element.offsetWidth - this.margin.left - this.margin.right;
    this.height_7 = element.offsetHeight - this.margin.top - this.margin.bottom;

    let svg_7 = d3.select(element)
    .append('svg')
    .attr('width', element.offsetWidth)
    .attr('height', element.offsetHeight);

    this.chart_7 = svg_7
    .append('g')
    .attr('class', 'bars7')
    .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    this.xScale_7 = d3.scaleLinear()
    .domain([d3.min(this.dataset_n7, d => d.val_x), d3.max(this.dataset_n7, d => d.val_x)])
    .range([0, this.width_7]);

    this.yScale_7 = d3.scaleLinear()
    .domain([0, 127])
    .range([this.height_7, 0]);

    // x&y axis
    this.xAxis_7 = svg_7
    .append('g')
    .attr('class', 'xAxis7')
    .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height_7})`)
    .call(d3.axisBottom(this.xScale_7));

    this.yAxis_7 = svg_7
    .append('g')
    .attr('class', 'yAxis7')
    .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
    .call(d3.axisLeft(this.yScale_7));

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
    update3.transition()
      .attr("width", this.barWidth_3 - this.barPadding)
      .attr("height", (d, i) => this.height*(d.n_Note_velocity)/d3.max(this.dataset_n3, d => d.n_Note_velocity))
      .attr('x', (d, i) => this.xScale_3(d.Note_velocity))
      .attr('y', (d, i) => this.height - this.height*(d.n_Note_velocity)/d3.max(this.dataset_n3, d => d.n_Note_velocity));

    // add new bars
    update3
      .enter()
      .append('rect')
      .attr('class', 'bar3')
      .attr('id', (d,i) => 'bars3_' + i)
      .attr("width", this.barWidth_3 - this.barPadding)
      .attr('x', (d, i) => this.xScale_3(d.Note_velocity))
      .attr('y', d => this.yScale_3(0))
      .attr('height', 0)
      .on('mouseover', (d, i) => this.set_hovered(d,i))
      .on('mouseout', (d, i) => this.free_hovered(d,i))
      .transition()
      .delay((d, i) => i * 5)
      .attr('y', (d, i) => this.height - this.height*(d.n_Note_velocity)/d3.max(this.dataset_n3, d => d.n_Note_velocity))
      .attr("height", (d, i) => this.height*(d.n_Note_velocity)/d3.max(this.dataset_n3, d => d.n_Note_velocity));
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

    update4.transition()
      .attr('x', d => this.xScale_4(d.Note_position))
      .attr('y', d => this.height - this.height*(d.n_Note_position)/d3.max(this.dataset_n4, d => d.n_Note_position))
      .attr('width', this.barWidth_4 - this.barPadding)
      .attr('height', (d, i) => this.height*(d.n_Note_position)/d3.max(this.dataset_n4, d => d.n_Note_position))
      .style('fill', d => d.color)

    update4
      .enter()
      .append('rect')
      .attr('class', 'bar4')
      .attr('id', (d,i) => 'bars4_' + i)
      .attr('x', d => this.xScale_4(d.Note_position))
      .attr('width', this.barWidth_4 - this.barPadding)
      .style('fill', d => d.color)
      .on('mouseover', (d, i) => this.set_hovered(d,i))
      .on('mouseout', (d, i) => this.free_hovered(d,i))
      .transition()
      .attr('height', (d, i) => this.height*(d.n_Note_position)/d3.max(this.dataset_n4, d => d.n_Note_position))
      .attr('y', d => this.height - this.height*(d.n_Note_position)/d3.max(this.dataset_n4, d => d.n_Note_position))
 }

  updateChart6() {
    this.xScale_6.domain([d3.min(this.dataset_n6, d => d.val_x), d3.max(this.dataset_n6, d => d.val_x)]);
    this.yScale_6.domain([d3.min(this.dataset_n6, d => d.val_y), d3.max(this.dataset_n6, d => d.val_y)]);
    this.xAxis_6.transition().call(d3.axisBottom(this.xScale_6));
    this.yAxis_6.transition().call(d3.axisLeft(this.yScale_6));

    let update_6 = this.chart_6.selectAll('.bar6')
      .data(this.dataset_n6);

    // remove existing bars
    update_6.exit().remove();

    update_6.transition()
      .attr('x', d => this.xScale_6(d.val_x))
      .attr('y', d => this.yScale_6(d.val_y))
      .attr('width', d => this.xScale_6(d.Timing_Difference))
      .attr('height', this.elements_height)

    update_6
      .enter()
      .append('rect')
      .attr('class', 'bar6')
      .attr('id', (d, i) => 'bars6_' + i)
      .attr('x', d => this.xScale_6(d.val_x))
      .attr('width', d => this.xScale_6(d.Timing_Difference))
      .attr('height', this.elements_height)
      .style('fill', d => d.color)
      .on('mouseover', (d, i) => this.set_hovered(d,i))
      .on('mouseout', (d, i) => this.free_hovered(d,i))
      .transition()
      .attr('y', d => this.yScale_6(d.val_y))

  }

  updateChart7() {
    this.xScale_7.domain([d3.min(this.dataset_n7, d => d.val_x), d3.max(this.dataset_n7, d => d.val_x)]);
    this.yScale_7.domain([d3.min(this.dataset_n7, d => d.val_y), d3.max(this.dataset_n7, d => d.val_y)]);
    this.xAxis_7.transition().call(d3.axisBottom(this.xScale_7));
    this.yAxis_7.transition().call(d3.axisLeft(this.yScale_7));

    let update_7 = this.chart_7.selectAll('.bar7')
      .data(this.dataset_n7);

    // remove existing bars
    update_7.exit().remove();

    update_7.transition()
      .attr('x', d => this.xScale_7(d.val_x))
      .attr('y', d => this.height_7 - this.height_7*(d.val_y)/d3.max(this.dataset_n7, d => d.val_y))
      .attr('width', this.barWidth_7 - this.barPadding_7)
      .attr('height', d => this.height_7*(d.val_y)/d3.max(this.dataset_n7, d => d.val_y))
      .style('fill', d => "black")
      // .style('fill', d => d3.interpolateOranges(d.val_y/d3.max(this.dataset_n7, d => d.val_y + 20)))

    update_7
      .enter()
      .append('rect')
      .attr('class', 'bar7')
      .attr('id', (d,i) => 'bars7_' + i)
      .attr('x', d => this.xScale_7(d.val_x))
      .attr('width', this.barWidth_7 - this.barPadding_7)
      .attr('height', d => this.height_7*(d.val_y)/d3.max(this.dataset_n7, d => d.val_y))
      .style('fill', d => "black")
      // .style('fill', d => d3.interpolateOranges(d.val_y/d3.max(this.dataset_n7, d => d.val_y + 20)))
      .on('mouseover', (d, i) => this.set_hovered(d,i))
      .on('mouseout', (d, i) => this.free_hovered(d,i))
      .transition()
      .attr('y', d => this.height_7 - this.height_7*(d.val_y)/d3.max(this.dataset_n7, d => d.val_y))
  }
}