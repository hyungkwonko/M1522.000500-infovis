import { IMusic } from './../music';
import { Component, OnInit, Input, AfterViewInit, NgModule, ViewChild } from '@angular/core';
import Vex from 'vexflow/src/index.js';
import * as d3 from 'd3';
import { LoadingBarModule, LoadingBarService } from '@ngx-loading-bar/core'
import { MatSliderChange } from '@angular/material/slider';
import { element } from 'protractor';

@Component({
  selector: 'app-dantae',
  templateUrl: './dantae.component.html',
  styleUrls: ['./dantae.component.css']
})
export class DantaeComponent implements OnInit, AfterViewInit {

  @Input() public data: IMusic;
  
  @Input() public disabled = true;
  @Input() public max = 100;
  @Input() public min = 0;
  @Input() public value = 0;

  public group: any;
  public hasRendered = false;
  public spinner: any;
  public div: any;
  public ID2IDs = {};

  ngOnInit() {
    this.hasRendered = false;
  }

  ngAfterViewInit() {
    this.spinner = document.getElementById("score-progress-spinner");
    this.spinner.style.display = "none";
    this.div = document.getElementById("score-view");
  }

  ngOnChanges(changes) {
    if (typeof changes !== "undefined" && 'data' in changes &&
      typeof changes.data.currentValue !== "undefined" &&
      'Filename' in changes.data.currentValue && changes.data.currentValue.Filename) {
      this.beforeRendering();
      setTimeout(this.createScore, 1, this);
    }
  }

  beforeRendering() {
    this.hasRendered = false;
    this.disabled = true;
    this.value = 0;
    this.spinner.style.display = "block";
    while (this.div.hasChildNodes()) {
      this.div.removeChild(this.div.firstChild);
    }
    console.log("start rendering");
  }
  
  afterRendering(obj) {
    console.log("score rendering complete");
    obj.value = 0;
    if (typeof obj.group !== "undefined") {
      obj.group.style.transform = "translate(-0px, 0)";
    }
    obj.disabled = false;
    obj.spinner.style.display = "none";
    obj.hasRendered = true;
  }

  createScore(obj) {
    let VF = Vex.Flow;

    // Create an SVG renderer and attach it to the DIV element named "score_view".
    let div = document.getElementById("score-view")
  
    let renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    let renderWidth = 1050;
  
    // Configure the rendering context.
    renderer.resize(renderWidth, 420);
    let ctx = renderer.getContext();
    ctx.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
    obj.group = ctx.openGroup();
  
    let registry = new VF.Registry();
    VF.Registry.enableDefaultRegistry(registry);
    let getNoteId = (id: string) : any => {
      return registry.getElementById(id);
    }
  
    let x = 0;
    let y = 0;
    let width = 600;
    let height = 0;
    let voices = [];
    let formatter = new VF.Formatter();
    let measureCount = obj.data.Score.Staves[0].length;
  
    obj.data.Score.Staves.forEach(voiceData => {
      let voiceInMeasures = []
      voiceData.forEach(measure => {
        let stave = new VF.Stave(x, y, width);
        if (measure.End_bar === 'single') {
          stave.setEndBarType(VF.Barline.type.SINGLE);
        }
        else if (measure.End_bar === 'double') {
          stave.setEndBarType(VF.Barline.type.DOUBLE);
        }
        else if (measure.End_bar === 'end') {
          stave.setEndBarType(VF.Barline.type.END);
        }
        let notes = []
        measure.Notations.forEach(notation => {
          if (notation.Type === 'clef') {
            stave.addClef(notation.Options);
          }
          else if (notation.Type === 'key_signature') {
            stave.addKeySignature(notation.Options);
          }
          else if (notation.Type === 'time_signature') {
            stave.addTimeSignature(notation.Options);
          }
          else if (notation.Type === 'set_tempo') {
            //stave.setTempo(notation.Options, 0);
            // TODO preprocessing 'Options': { duration: '4', bpm: 80 }
          }
          else if (notation.Type === 'note') {
            let note = new VF.StaveNote(notation.Options);
            note.setAttribute('id', notation.Element_id);
            for (let i = 0; i < notation.IDs.length; i++) {
              if (!(notation.IDs[i].toString() in obj.ID2IDs)) {
                obj.ID2IDs[notation.IDs[i].toString()] = notation.IDs;
              }
            }
            let str : string;
            if (typeof notation.Options !== "string") {
              str = notation.Options.duration;
              for (let i = 0; i < str.length; i++) {
                if (str[i] === "d") note.addDotToAll();
              }
            }
            notes.push(note);
          }
          else if (notation.Type === 'rest') {
            let note = new VF.StaveNote(notation.Options);
            let str : string;
            if (typeof notation.Options !== "string") {
              str = notation.Options.duration;
              for (let i = 0; i < str.length; i++) {
                if (str[i] === "d") note.addDotToAll();
              }
            }
            notes.push(note);
          }
        });
        stave.setContext(ctx).draw();
        
        let voice = new VF.Voice();
        VF.Accidental.applyAccidentals([voice], measure.Key_signature);
        voice.setStrict(false).addTickables(notes).setStave(stave);
  
        formatter.joinVoices([voice]).formatToStave([voice], stave);
        voiceInMeasures.push([voice, stave, x]);
        height = Math.max(voice.getBoundingBox().getH() * 1.3, height);
  
        /*
        //width = formatter.preCalculateMinTotalWidth([voice]) * 1.4;
        console.log(height + ' / ' + width + ', ' + (voice.getBoundingBox().getW() * 1.4))
  
        stave.setWidth(width);
        voice.setStave(stave);
        stave.setContext(ctx).draw();
  
        formatter = new VF.Formatter().joinVoices([voice]).format([voice]);
        */
  
        x += width;
      });
      y += height;
      height = 0;
      x = 0;
      voices.push(voiceInMeasures);
    });
    x = width * measureCount;
    obj.max = Math.max(0, x - renderWidth);
    // Now x and y is the total size of score graphic.
    console.log("while rendering score...");
    ctx.setViewBox(0, -70, renderWidth, y + 70);
    ctx.svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
  
    for (let i = 0; i < voices[0].length; i++) {
      let f = [];
      let s = [];
      voices.forEach(v => {
        f.push(v[i][0]);
        s.push([v[i][1], v[i][2]]);
      });
  
      let getNoteStartX = (stave: any) : number => {
        return stave[0].getNoteStartX();
      }
  
      let startX = Math.max(...s.map(getNoteStartX));
      s.forEach(stave => stave[0].setNoteStartX(startX));

      formatter.format(f, width - (startX - s[0][1]));
      voices.forEach(v => v[i][0].setContext(ctx).draw());
    }
  
    let ties = [];
  
    obj.data.Score.Ties.forEach(tie => {
      ties.push(new VF.StaveTie({
        first_note: getNoteId(tie.from),
        last_note: getNoteId(tie.to),
        first_indices: tie.first_indices,
        last_indices: tie.last_indices
      }));
    });
    ties.forEach(function(t) {t.setContext(ctx).draw()});
  
    ctx.closeGroup();
    obj.group.id = "score_group"
  
    VF.Registry.disableDefaultRegistry();

    obj.data.Notes.forEach(element => {
      obj.initializeNoteheadsByNoteID(element.ID);
    });

    obj.afterRendering(obj);
  }

  initializeNoteheadsByNoteID(noteID: number, obj: DantaeComponent) {
    if (typeof obj === "undefined") obj = this;
    let index = obj.ID2IDs[noteID.toString()].indexOf(noteID);
    let representativeNote = obj.ID2IDs[noteID.toString()][0];
    let noteData = obj.data.Notes.find(note => note.ID === noteID);
    let stavenoteList = document.querySelectorAll('[id^="vf-' + representativeNote.toString() + '-"]');
    stavenoteList.forEach(element => {
      let noteheadG = obj.findAllChildrenByClass(element, 'vf-notehead');
      let notehead;
      if (noteheadG.length > index) {
        notehead = noteheadG[index].firstChild;
      }
      else {
        //console.log(noteID.toString() + " does not exist!");
        return;
      }

      let enter = d3.select(notehead)
                    .data([noteData], function(d) { return noteID.toString() })
                    .enter()
                    .on('mouseenter', d => {d3.select(notehead).attr('fill', 'red')})//d => d.State.hovered = true)
                    .on('mouseout', d => {d3.select(notehead).attr('fill', 'blue')})//d => d.State.hovered = false)

      let update = d3.select(notehead)
                     .data([noteData], function(d) { return noteID.toString() })
                     .attr('fill', d => /*color(d.state)*/'blue')  // 색 함수(state => colorString)에 넣어서 처리
                     .on('mouseenter', d => {d3.select(notehead).attr('fill', 'red')})//d => d.State.hovered = true)
                     .on('mouseout', d => {d3.select(notehead).attr('fill', 'blue')})//d => d.State.hovered = false)
                     //.on('onclick', d => d.State.selected = true)
      /*
      let exit = d3.select(notehead)
                   .data([noteData], function(d) { return noteID.toString() })
                   .exit();
      */
    });
  }

  findAllChildrenByClass(element: any, className: string) {
    let foundElements = [];
    function recurse(element: any, className: string) {
      for (let i = 0; i < element.childNodes.length; i++) {
          let el = element.childNodes[i];
          if (el.getAttribute('class') == className) {
            foundElements.push(element.childNodes[i]);
          }
          recurse(element.childNodes[i], className);
      }
    }
    recurse(element, className);
    return foundElements;
  }

  onSliderChange(event: MatSliderChange) {
    if (event.value >= 0 && typeof this.group !== "undefined") {
      this.group.style.transform = "translate(-" + event.value + "px, 0)";
    }
  }

}
