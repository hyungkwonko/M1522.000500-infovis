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
  public color: Array<string> = ["#77D977", "#A877D9", "#D9D977", "#77A8D9", "#D97777", "#77D9A8", "#D977D9", "#A8D977", "#7777D9", "#D9A877", "#77D9D9", "#D977A8"];
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
  //private barWidth_7: number;
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

  private update_6: any;
  private update_7: any;



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

  public velocityToColor(velocity: number) {
    if (velocity <= 20) {
      return '#333333';
    } else if (velocity <= 37) {
      return '#4D4D4D'
    } else if (velocity <= 52) {
      return '#666666'
    } else if (velocity <= 67) {
      return '#808080'
    } else if (velocity <= 83) {
      return '#999999'
    } else if (velocity <= 100) {
      return '#B3B3B3'
    } else if (velocity <= 117) {
      return '#CCCCCC'
    } else {
      return '#E6E6E6'
    } 
  }

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
          "velocity_color": this.velocityToColor(i),
          "Note_IDs": this.return_data_v[i]
        }
      );
      this.dataset_n4.push(
        {
          "n_Note_position" : this.return_data_p[i].length, // y_val
          "Note_position" : i, // x_val
          // "color": that.RGBtoHSV(bar_color_domain[i%12])
          'pitch_class_color': this.color[i % 12],
          "Note_IDs": this.return_data_p[i]
        }
      );
    };
    
    // for setting playing position
    this.dataset_n6.push(
      {
        "val_x": 0,
        "val_y": 127,
        "pitch_class": 0,
        'pitch_class_color': '#003b96',
        "Timing_Difference": 1000,
        "velocity_color": '#000000',
        "position": 0,
        "State": { hovered: false, selected: false, playing: false }
      }
    );
    this.dataset_n7.push(
      {
        "val_x": 0,
        "val_y": 127,
        "pitch_class": 0,
        'velocity_color': '#003b96',
        "Timing_Difference": 1000,
        "position": 0,
        "State": { hovered: false, selected: false, playing: false }
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
            "pitch_class_color": this.color[parseInt(this.mold.Notes[i].Note_position)%12],
            "Timing_Difference": this.mold.Notes[i].End_timing - this.mold.Notes[i].Start_timing,
            "velocity_color": this.velocityToColor(this.mold.Notes[i].Note_velocity),
            "position": this.mold.Notes[i].Note_position,
            "State": this.mold.Notes[i].State
          }
        );
        this.dataset_n7.push(
          {
            "ID": this.mold.Notes[i].ID,
            "class": String(this.mold.Notes[i].ID),
            "val_x": this.mold.Notes[i].Start_timing,
            "val_y": this.mold.Notes[i].Note_velocity,
            "velocity_color": this.velocityToColor(this.mold.Notes[i].Note_velocity),
            "Timing_Difference": this.mold.Notes[i].End_timing - this.mold.Notes[i].Start_timing,
            "position": this.mold.Notes[i].Note_position,
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

  set_hovered(d, i, nodes) {
    //d.State.hovered = true;
    function c(da): any {
      return d3.rgb(da.pitch_class_color).darker(2);
    } 
    d3.selectAll('.bar6')
      .filter(da => da["ID"] === d.ID)
      .style('stroke', c(this.dataset_n6.find((e) => e.ID === d.ID)))
      .style('stroke-width', '3');
    d3.selectAll('.bar7')
      .filter(da => da["ID"] === d.ID)
      .style('stroke', "#1ad669")
      .style('stroke-width', '3');
  }

  set_hovered_group3(d, i, nodes) {
    function c(da): any {
      return d3.rgb(da.pitch_class_color).darker(2);
    } 
    d3.selectAll('.bars3')
      .filter(da => d.velocity_color === da["velocity_color"])
      .style('stroke', "#1ad669")
      .style('stroke-width', '3');
    console.log("hello1");
    d3.selectAll('.bar6')
      .filter(da => da['velocity_color'] === d.velocity_color)
      .each((da, i2, nodes2) => d3.select(nodes2[i2])
        .style('stroke', c(da))
        .style('stroke-width', '3'));
    console.log("hello2");
    d3.selectAll('.bar7')
      .filter(da => d.velocity_color === da["velocity_color"])
      .style('stroke', "#1ad669")
      .style('stroke-width', '3');
    console.log("hello3");
  }

  free_hovered(d, i, nodes) {
    //d.State.hovered = false;
    d3.selectAll('.bar6')
      .filter(da => da["ID"] === d.ID)
      .style('stroke-width', '0');
      d3.selectAll('.bar7')
      .filter(da => da["ID"] === d.ID)
      .style('stroke-width', '0');
  }

  free_hovered_group3(d, i, nodes) {
    d3.selectAll('.bars3')
      .filter(da => d.velocity_color === da["velocity_color"])
      .style('stroke-width', '0');
    d3.selectAll('.bar6')
      .filter(da => da['velocity_color'] === d.velocity_color)
      .style('stroke-width', '0');
    d3.selectAll('.bar7')
      .filter(da => d.velocity_color === da["velocity_color"])
      .style('stroke-width', '0');
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
    //this.barWidth_7 = this.width / this.dataset_n7.length;

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
    this.xAxis_3.call(d3.axisBottom(this.xScale_3));
    this.yAxis_3.call(d3.axisLeft(this.yScale_3));

    let update3 = this.chart_3.selectAll('.bar3')
      .data(this.dataset_n3);

    // remove exiting bars
    update3.exit().remove();

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
      //.on('mouseover', (d, i, nodes) => this.set_hovered_group3(d, i, nodes))
      //.on('mouseout', (d, i, nodes) => this.free_hovered_group3(d, i, nodes))
      .attr('y', (d, i) => this.height - this.height*(d.n_Note_velocity)/d3.max(this.dataset_n3, d => d.n_Note_velocity))
      .attr("height", (d, i) => this.height*(d.n_Note_velocity)/d3.max(this.dataset_n3, d => d.n_Note_velocity));

      
    // update3 existing bars
    update3.attr("width", this.barWidth_3 - this.barPadding)
      .attr("height", (d, i) => this.height*(d.n_Note_velocity)/d3.max(this.dataset_n3, d => d.n_Note_velocity))
      .attr('x', (d, i) => this.xScale_3(d.Note_velocity))
      .attr('y', (d, i) => this.height - this.height*(d.n_Note_velocity)/d3.max(this.dataset_n3, d => d.n_Note_velocity));

  }

  updateChart4() {
    this.xScale_4.domain([d3.min(this.dataset_n4, d => d.Note_position), d3.max(this.dataset_n4, d => d.Note_position)]);
    this.yScale_4.domain([d3.min(this.dataset_n4, d => d.n_Note_position), d3.max(this.dataset_n4, d => d.n_Note_position)]);
    this.xAxis_4.call(d3.axisBottom(this.xScale_4));
    this.yAxis_4.call(d3.axisLeft(this.yScale_4));

    let update4 = this.chart_4.selectAll('.bar4')
    .data(this.dataset_n4);

    // remove existing bars
    update4.exit().remove();

    update4
      .enter()
      .append('rect')
      .attr('class', 'bar4')
      .attr('id', (d,i) => 'bars4_' + i)
      .attr('x', d => this.xScale_4(d.Note_position))
      .attr('width', this.barWidth_4 - this.barPadding)
      .style('fill', d => d.pitch_class_color)
      //.on('mouseover', (d, i, nodes) => this.set_hovered(d, i, nodes))
      //.on('mouseout', (d, i, nodes) => this.free_hovered(d, i, nodes))
      .attr('height', (d, i) => this.height*(d.n_Note_position)/d3.max(this.dataset_n4, d => d.n_Note_position))
      .attr('y', d => this.height - this.height*(d.n_Note_position)/d3.max(this.dataset_n4, d => d.n_Note_position))

      
    update4.attr('x', d => this.xScale_4(d.Note_position))
      .attr('y', d => this.height - this.height*(d.n_Note_position)/d3.max(this.dataset_n4, d => d.n_Note_position))
      .attr('width', this.barWidth_4 - this.barPadding)
      .attr('height', (d, i) => this.height*(d.n_Note_position)/d3.max(this.dataset_n4, d => d.n_Note_position))

 }

  updateChart6() {
    this.xScale_6.domain([d3.min(this.dataset_n6, d => d.val_x), d3.max(this.dataset_n6, d => d.val_x)]);
    this.yScale_6.domain([d3.min(this.dataset_n6, d => d.val_y), d3.max(this.dataset_n6, d => d.val_y)]);
    this.xAxis_6.call(d3.axisBottom(this.xScale_6));
    this.yAxis_6.call(d3.axisLeft(this.yScale_6));

    this.update_6 = this.chart_6.selectAll('.bar6')
      .data(this.dataset_n6);

    // remove existing bars
    this.update_6.exit().remove();

    this.update_6
      .enter()
      .append('rect')
      .attr('class', 'bar6')
      .attr('id', (d, i) => 'bars6_' + i)
      .attr('x', d => this.xScale_6(d.val_x))
      .attr('y', d => this.yScale_6(d.val_y))
      .attr('width', d => this.xScale_6(d.Timing_Difference) > 0 ? this.xScale_6(d.Timing_Difference) : 1)
      .attr('height', this.elements_height)
      .style('fill', d => d.pitch_class_color)
      .on('mouseover', (d, i, nodes) => this.set_hovered(d, i, nodes))
      .on('mouseout', (d, i, nodes) => this.free_hovered(d, i, nodes))


    this.update_6.attr('x', d => this.xScale_6(d.val_x))
      .attr('y', d => this.yScale_6(d.val_y))
      .attr('width', d => this.xScale_6(d.Timing_Difference) > 0 ? this.xScale_6(d.Timing_Difference) : 1)
      .attr('height', this.elements_height)
  }

  updateChart7() {
    this.xScale_7.domain([d3.min(this.dataset_n7, d => d.val_x), d3.max(this.dataset_n7, d => d.val_x)]);
    this.yScale_7.domain([d3.min(this.dataset_n7, d => d.val_y), d3.max(this.dataset_n7, d => d.val_y)]);
    this.xAxis_7.call(d3.axisBottom(this.xScale_7));
    this.yAxis_7.call(d3.axisLeft(this.yScale_7));

    this.update_7 = this.chart_7.selectAll('.bar7')
      .data(this.dataset_n7);

    // remove existing bars
    this.update_7.exit().remove();

    
    this.update_7
      .enter()
      .append('rect')
      .attr('class', 'bar7')
      .attr('id', (d,i) => 'bars7_' + i)
      .attr('x', d => this.xScale_7(d.val_x))
      .attr('y', d => this.height_7 - this.height_7*(d.val_y)/d3.max(this.dataset_n7, d => d.val_y))
      .attr('width', d => this.xScale_7(d.Timing_Difference) > 0 ? this.xScale_7(d.Timing_Difference) : 1)
      .attr('height', d => this.height_7*(d.val_y)/d3.max(this.dataset_n7, d => d.val_y))
      .style('fill', d => this.velocityToColor(d.val_y))
      .on('mouseover', (d, i, nodes) => this.set_hovered(d, i, nodes))
      .on('mouseout', (d, i, nodes) => this.free_hovered(d, i, nodes))

    this.update_7.attr('x', d => this.xScale_7(d.val_x))
      .attr('y', d => this.height_7 - this.height_7*(d.val_y)/d3.max(this.dataset_n7, d => d.val_y))
      .attr('width', d => this.xScale_7(d.Timing_Difference) > 0 ? this.xScale_7(d.Timing_Difference) : 1)
      .attr('height', d => this.height_7*(d.val_y)/d3.max(this.dataset_n7, d => d.val_y))

  }
}