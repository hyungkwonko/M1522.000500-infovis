import { Component, OnInit, AfterViewInit } from '@angular/core';
import Vex from 'vexflow/src/index.js'
import * as d3 from 'd3'

@Component({
  selector: 'app-dantae',
  templateUrl: './dantae.component.html',
  styleUrls: ['./dantae.component.css']
})
export class DantaeComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.createScore();

  }

  createScore() {
    let VF = Vex.Flow;

    /*
    // Create an SVG renderer and attach it to the DIV element named "boo".
    let div = document.getElementById("bbb")
    let renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(500, 200);
    let context = renderer.getContext();
    context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
    */

    let vf = new VF.Factory({
      renderer: {
        elementId: 'bbb'
      }
    });
    let ctx = vf.getContext();
    // Create a stave of width 400 at position 10, 40 on the canvas.
    //let stave = new VF.Stave(10, 40, 400);
    let stave = vf.Stave();

    // Add a clef and time signature.
    stave.addClef("treble").addTimeSignature("4/4");
    /*
    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();
    */

    let notes = [
      new VF.StaveNote({ keys: ["e##/5"], duration: "8d" }).
        addAccidental(0, new VF.Accidental("##")).addDotToAll(),
      new VF.StaveNote({ keys: ["b/4"], duration: "16" }).
        addAccidental(0, new VF.Accidental("b")),
      new VF.StaveNote({ keys: ["c/4"], duration: "8" }),
      new VF.StaveNote({ keys: ["d/4"], duration: "16" }),
      new VF.StaveNote({ keys: ["d/4"], duration: "16" }),
      new VF.StaveNote({ keys: ["d/4"], duration: "q" }),
      new VF.StaveNote({ keys: ["d/4"], duration: "q" }),
      new VF.StaveNote({ keys: ["d/4"], duration: "q" }),
      new VF.StaveNote({ keys: ["eb/4"], duration: "q" }),
      new VF.StaveNote({ keys: ["f/4"], duration: "q" }),
      new VF.StaveNote({ keys: ["g#/4"], duration: "h" }),
      new VF.BarNote({ type: 'single'})
    ];

    /*
    let beams = VF.Beam.generateBeams(notes);
    VF.Formatter.FormatAndDraw(context, stave, notes);
    beams.forEach(function(b) {b.setContext(context).draw()})

    let ties = [
      new VF.StaveTie({
        first_note: notes[4],
        last_note: notes[5],
        first_indices: [0],
        last_indices: [0]
      }),
      new VF.StaveTie({
        first_note: notes[5],
        last_note: notes[6],
        first_indices: [0],
        last_indices: [0]
      })
    ];
    ties.forEach(function(t) {t.setContext(context).draw()})
    */
    let voice = vf.Voice().addTickables(notes);
    vf.Formatter()
      .joinVoices([voice])
      .formatToStave([voice], stave);
    vf.draw();
    /*
    let div2 = document.getElementById("aaa");
    let renderer2 = new VF.Renderer(div2, VF.Renderer.Backends.SVG);
    renderer2.resize(500, 200);
    let ctx = renderer2.getContext();

    // Create a stave of width 400 at position 10, 40 on the canvas.
    let stave2 = new VF.Stave(10, 40, 400);

    // Add a clef and time signature.
    stave2.addClef("treble").addTimeSignature("4/4");

    // Connect it to the rendering context and draw!
    stave2.setContext(ctx).draw();
    /*
    let notes2 = [
      // Beam
      { keys: ['b/4'], duration: '8', stem_direction: -1 },
      { keys: ['b/4'], duration: '8', stem_direction: -1 },
      { keys: ['b/4'], duration: '8', stem_direction: 1 },
      { keys: ['b/4'], duration: '8', stem_direction: 1 },
      { keys: ['d/6'], duration: '8', stem_direction: -1 },
      { keys: ['c/6', 'd/6'], duration: '8', stem_direction: -1 },
      { keys: ['d/6', 'e/6'], duration: '8', stem_direction: -1 },
    ];
    
    let stave_notes = notes2.map(function(note) { return new VF.StaveNote(note); });
    /*
    stave_notes[0].setStemStyle({ strokeStyle: 'green' });
    stave_notes[1].setStemStyle({ strokeStyle: 'orange' });
    stave_notes[1].setKeyStyle(0, { fillStyle: 'chartreuse' });
    stave_notes[2].setStyle({ fillStyle: 'tomato', strokeStyle: 'tomato' });
    
    stave_notes[0].setKeyStyle(0, { fillStyle: 'purple' });
    stave_notes[4].setLedgerLineStyle({ fillStyle: 'red', strokeStyle: 'red' });
    stave_notes[6].setFlagStyle({ fillStyle: 'orange', strokeStyle: 'orante' });
    */
    /*
    let beam1 = new VF.Beam([stave_notes[0], stave_notes[1]]);
    let beam2 = new VF.Beam([stave_notes[2], stave_notes[3]]);
    let beam3 = new VF.Beam(stave_notes.slice(4, 6));
    
    beam1.setStyle({
      fillStyle: 'blue',
      strokeStyle: 'blue',
    });
    
    beam2.setStyle({
      shadowBlur: 20,
      shadowColor: 'blue',
    });
    */
    
    //VF.Formatter.FormatAndDraw(ctx, stave2, stave_notes, false);
    
    /*
    beam1.setContext(ctx).draw();
    beam2.setContext(ctx).draw();
    beam3.setContext(ctx).draw();
    */
  }

}
