import { IMusic } from './../music';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import Vex from 'vexflow/src/index.js'
import * as d3 from 'd3'

@Component({
  selector: 'app-dantae',
  templateUrl: './dantae.component.html',
  styleUrls: ['./dantae.component.css']
})
export class DantaeComponent implements OnInit, AfterViewInit {

  @Input() public data: IMusic;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes) {
    if (changes.data.currentValue.Filename) {
      this.createScore();
    }
  }

  createScore() {
    let VF = Vex.Flow;


    // Create an SVG renderer and attach it to the DIV element named "score_view".
    let div = document.getElementById("score_view")
    let renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(1100, 600);
    let ctx = renderer.getContext();
    ctx.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
    ctx.scale(0.4, 0.4);

    let registry = new VF.Registry();
    VF.Registry.enableDefaultRegistry(registry);
    let getNoteId = (id: string) : any => {
      return registry.getElementById(id);
    }

    let x = 0;
    let y = 0;
    let width = 400;
    let height = 0;
    let voices = []
    let formatter = new VF.Formatter();
    console.log(this.data)
    let measureCount = this.data.Score.Staves[0].length;

    this.data.Score.Staves.forEach(voiceData => {
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
            let str = notation.Options.duration;
            for (let i = 0; i < str.length; i++) {
              if (str[i] === "d") note.addDotToAll();
            }
            notes.push(note);
          }
          else if (notation.Type === 'rest') {
            let note = new VF.StaveNote(notation.Options);
            let str = notation.Options.duration;
            for (let i = 0; i < str.length; i++) {
              if (str[i] === "d") note.addDotToAll();
            }
            notes.push(note);
          }
        });
        stave.setContext(ctx).draw();
        
        let voice = new VF.Voice();
        VF.Accidental.applyAccidentals([voice], measure.Key_signature);
        voice.setStrict(false).addTickables(notes).setStave(stave);

        formatter.joinVoices([voice]).format([voice]);
        voiceInMeasures.push([voice, stave, x]);
        height = Math.max(voice.getBoundingBox().getH() * 1.5, height);

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
    // Now x and y is the total size of score graphic.

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

    this.data.Score.Ties.forEach(tie => {
      ties.push(new VF.StaveTie({
        first_note: getNoteId(tie.from),
        last_note: getNoteId(tie.to),
        first_indices: tie.first_indices,
        last_indices: tie.last_indices
      }));
    });
    ties.forEach(function(t) {t.setContext(ctx).draw()});

    VF.Registry.disableDefaultRegistry();
  }

}
