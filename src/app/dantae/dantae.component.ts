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

  //@Input() public data: IMusic;
  public data = {
    "Filename":"song2","Ticks_per_beat":192,"Events":[{"Type":"text","Is_meta":true,"Delta_tick":0,"Tick":0,"Timing":0,"Current_tempo":500000,"Sequence_position":0,"Attributes":[]},{"Type":"copyright","Is_meta":true,"Delta_tick":0,"Tick":0,"Timing":0,"Current_tempo":500000,"Sequence_position":1,"Attributes":[]},{"Type":"copyright","Is_meta":true,"Delta_tick":0,"Tick":0,"Timing":0,"Current_tempo":500000,"Sequence_position":2,"Attributes":[]},{"Type":"text","Is_meta":true,"Delta_tick":0,"Tick":0,"Timing":0,"Current_tempo":500000,"Sequence_position":3,"Attributes":[]},{"Type":"key_signature","Is_meta":true,"Delta_tick":0,"Tick":0,"Timing":0,"Current_tempo":500000,"Sequence_position":4,"Attributes":["key"],"Key":"E"},{"Type":"time_signature","Is_meta":true,"Delta_tick":0,"Tick":0,"Timing":0,"Current_tempo":500000,"Sequence_position":5,"Attributes":["Numerator","Denominator","Clocks_per_click","Notated_32nd_notes_per_beat"],"Numerator":4,"Denominator":4,"Clocks_per_click":24,"Notated_32nd_notes_per_beat":8},{"Type":"midi_port","Is_meta":true,"Delta_tick":0,"Tick":0,"Timing":0,"Current_tempo":500000,"Sequence_position":6,"Attributes":[]},{"Type":"track_name","Is_meta":true,"Delta_tick":0,"Tick":0,"Timing":0,"Current_tempo":500000,"Sequence_position":7,"Attributes":[]},{"Type":"control_change","Is_meta":false,"Delta_tick":0,"Tick":0,"Timing":0,"Current_tempo":500000,"Sequence_position":8,"Attributes":["Channel","Control","Value"],"Channel":0,"Control":7,"Value":127},{"Type":"control_change","Is_meta":false,"Delta_tick":0,"Tick":0,"Timing":0,"Current_tempo":500000,"Sequence_position":9,"Attributes":["Channel","Control","Value"],"Channel":0,"Control":10,"Value":64},{"Type":"note_on","Is_meta":false,"Delta_tick":0,"Tick":0,"Timing":0,"Current_tempo":500000,"Sequence_position":10,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":0,"Note_position":76,"Note_velocity":110},{"Type":"midi_port","Is_meta":true,"Delta_tick":0,"Tick":0,"Timing":0,"Current_tempo":500000,"Sequence_position":11,"Attributes":[]},{"Type":"track_name","Is_meta":true,"Delta_tick":0,"Tick":0,"Timing":0,"Current_tempo":500000,"Sequence_position":12,"Attributes":[]},{"Type":"control_change","Is_meta":false,"Delta_tick":0,"Tick":0,"Timing":0,"Current_tempo":500000,"Sequence_position":13,"Attributes":["Channel","Control","Value"],"Channel":1,"Control":7,"Value":127},{"Type":"control_change","Is_meta":false,"Delta_tick":0,"Tick":0,"Timing":0,"Current_tempo":500000,"Sequence_position":14,"Attributes":["Channel","Control","Value"],"Channel":1,"Control":10,"Value":64},{"Type":"note_on","Is_meta":false,"Delta_tick":0,"Tick":0,"Timing":0,"Current_tempo":500000,"Sequence_position":15,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":68,"Note_velocity":110},{"Type":"note_on","Is_meta":false,"Delta_tick":0,"Tick":0,"Timing":0,"Current_tempo":500000,"Sequence_position":16,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":71,"Note_velocity":110},{"Type":"note_off","Is_meta":false,"Delta_tick":160,"Tick":160,"Timing":416667,"Current_tempo":500000,"Sequence_position":17,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":0,"Note_position":76,"Note_velocity":0},{"Type":"note_on","Is_meta":false,"Delta_tick":32,"Tick":192,"Timing":500000,"Current_tempo":500000,"Sequence_position":18,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":0,"Note_position":75,"Note_velocity":110},{"Type":"note_off","Is_meta":false,"Delta_tick":160,"Tick":352,"Timing":916667,"Current_tempo":500000,"Sequence_position":19,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":0,"Note_position":75,"Note_velocity":0},{"Type":"note_on","Is_meta":false,"Delta_tick":32,"Tick":384,"Timing":1000000,"Current_tempo":500000,"Sequence_position":20,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":0,"Note_position":71,"Note_velocity":110},{"Type":"note_on","Is_meta":false,"Delta_tick":0,"Tick":384,"Timing":1000000,"Current_tempo":500000,"Sequence_position":21,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":0,"Note_position":76,"Note_velocity":110},{"Type":"note_off","Is_meta":false,"Delta_tick":40,"Tick":424,"Timing":1104167,"Current_tempo":500000,"Sequence_position":22,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":68,"Note_velocity":0},{"Type":"note_off","Is_meta":false,"Delta_tick":0,"Tick":424,"Timing":1104167,"Current_tempo":500000,"Sequence_position":23,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":71,"Note_velocity":0},{"Type":"note_on","Is_meta":false,"Delta_tick":56,"Tick":480,"Timing":1250000,"Current_tempo":500000,"Sequence_position":24,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":69,"Note_velocity":110},{"Type":"note_on","Is_meta":false,"Delta_tick":0,"Tick":480,"Timing":1250000,"Current_tempo":500000,"Sequence_position":25,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":75,"Note_velocity":110},{"Type":"note_off","Is_meta":false,"Delta_tick":64,"Tick":544,"Timing":1416667,"Current_tempo":500000,"Sequence_position":26,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":0,"Note_position":71,"Note_velocity":0},{"Type":"note_off","Is_meta":false,"Delta_tick":0,"Tick":544,"Timing":1416667,"Current_tempo":500000,"Sequence_position":27,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":0,"Note_position":76,"Note_velocity":0},{"Type":"note_on","Is_meta":false,"Delta_tick":32,"Tick":576,"Timing":1500000,"Current_tempo":500000,"Sequence_position":28,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":0,"Note_position":68,"Note_velocity":110},{"Type":"note_on","Is_meta":false,"Delta_tick":0,"Tick":576,"Timing":1500000,"Current_tempo":500000,"Sequence_position":29,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":0,"Note_position":73,"Note_velocity":110},{"Type":"note_off","Is_meta":false,"Delta_tick":64,"Tick":640,"Timing":1666667,"Current_tempo":500000,"Sequence_position":30,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":69,"Note_velocity":0},{"Type":"note_off","Is_meta":false,"Delta_tick":0,"Tick":640,"Timing":1666667,"Current_tempo":500000,"Sequence_position":31,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":75,"Note_velocity":0},{"Type":"note_on","Is_meta":false,"Delta_tick":32,"Tick":672,"Timing":1750000,"Current_tempo":500000,"Sequence_position":32,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":71,"Note_velocity":110},{"Type":"note_off","Is_meta":false,"Delta_tick":64,"Tick":736,"Timing":1916667,"Current_tempo":500000,"Sequence_position":33,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":0,"Note_position":73,"Note_velocity":0},{"Type":"note_on","Is_meta":false,"Delta_tick":32,"Tick":768,"Timing":2000000,"Current_tempo":500000,"Sequence_position":34,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":0,"Note_position":69,"Note_velocity":110},{"Type":"note_off","Is_meta":false,"Delta_tick":80,"Tick":848,"Timing":2208333,"Current_tempo":500000,"Sequence_position":35,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":71,"Note_velocity":0},{"Type":"note_on","Is_meta":false,"Delta_tick":16,"Tick":864,"Timing":2250000,"Current_tempo":500000,"Sequence_position":36,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":73,"Note_velocity":110},{"Type":"note_off","Is_meta":false,"Delta_tick":64,"Tick":928,"Timing":2416667,"Current_tempo":500000,"Sequence_position":37,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":0,"Note_position":68,"Note_velocity":0},{"Type":"note_off","Is_meta":false,"Delta_tick":16,"Tick":944,"Timing":2458334,"Current_tempo":500000,"Sequence_position":38,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":73,"Note_velocity":0},{"Type":"note_on","Is_meta":false,"Delta_tick":16,"Tick":960,"Timing":2500001,"Current_tempo":500000,"Sequence_position":39,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":73,"Note_velocity":110},{"Type":"note_on","Is_meta":false,"Delta_tick":0,"Tick":960,"Timing":2500001,"Current_tempo":500000,"Sequence_position":40,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":75,"Note_velocity":110},{"Type":"note_off","Is_meta":false,"Delta_tick":80,"Tick":1040,"Timing":2708334,"Current_tempo":500000,"Sequence_position":41,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":73,"Note_velocity":0},{"Type":"note_off","Is_meta":false,"Delta_tick":0,"Tick":1040,"Timing":2708334,"Current_tempo":500000,"Sequence_position":42,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":75,"Note_velocity":0},{"Type":"note_on","Is_meta":false,"Delta_tick":16,"Tick":1056,"Timing":2750001,"Current_tempo":500000,"Sequence_position":43,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":69,"Note_velocity":110},{"Type":"note_on","Is_meta":false,"Delta_tick":0,"Tick":1056,"Timing":2750001,"Current_tempo":500000,"Sequence_position":44,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":73,"Note_velocity":110},{"Type":"note_on","Is_meta":false,"Delta_tick":0,"Tick":1056,"Timing":2750001,"Current_tempo":500000,"Sequence_position":45,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":76,"Note_velocity":110},{"Type":"note_off","Is_meta":false,"Delta_tick":32,"Tick":1088,"Timing":2833334,"Current_tempo":500000,"Sequence_position":46,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":0,"Note_position":69,"Note_velocity":0},{"Type":"note_off","Is_meta":false,"Delta_tick":48,"Tick":1136,"Timing":2958334,"Current_tempo":500000,"Sequence_position":47,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":69,"Note_velocity":0},{"Type":"note_off","Is_meta":false,"Delta_tick":0,"Tick":1136,"Timing":2958334,"Current_tempo":500000,"Sequence_position":48,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":73,"Note_velocity":0},{"Type":"note_off","Is_meta":false,"Delta_tick":0,"Tick":1136,"Timing":2958334,"Current_tempo":500000,"Sequence_position":49,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":1,"Note_position":76,"Note_velocity":0},{"Type":"note_on","Is_meta":false,"Delta_tick":208,"Tick":1344,"Timing":3500001,"Current_tempo":500000,"Sequence_position":50,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":0,"Note_position":71,"Note_velocity":110},{"Type":"note_on","Is_meta":false,"Delta_tick":0,"Tick":1344,"Timing":3500001,"Current_tempo":500000,"Sequence_position":51,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":0,"Note_position":80,"Note_velocity":110},{"Type":"note_off","Is_meta":false,"Delta_tick":160,"Tick":1504,"Timing":3916668,"Current_tempo":500000,"Sequence_position":52,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":0,"Note_position":71,"Note_velocity":0},{"Type":"note_off","Is_meta":false,"Delta_tick":0,"Tick":1504,"Timing":3916668,"Current_tempo":500000,"Sequence_position":53,"Attributes":["Channel","Note_position","Note_velocity"],"Channel":0,"Note_position":80,"Note_velocity":0},{"Type":"end_of_track","Is_meta":true,"Delta_tick":0,"Tick":1504,"Timing":3916668,"Current_tempo":500000,"Sequence_position":54,"Attributes":[]}],"Notes":[{"ID":2,"Start_tick":0,"End_tick":160,"Start_timing":0,"End_timing":416667,"Channel":0,"Voice":0,"Is_chord":false,"Note_position":76,"Note_velocity":110,"Note_pitch_class":"E","Note_octave":5,"Note_duration":192,"Following_rest_duration":0},{"ID":0,"Start_tick":0,"End_tick":424,"Start_timing":0,"End_timing":1104167,"Channel":1,"Voice":1,"Is_chord":false,"Note_position":68,"Note_velocity":110,"Note_pitch_class":"G#","Note_octave":4,"Note_duration":480,"Following_rest_duration":0},{"ID":1,"Start_tick":0,"End_tick":424,"Start_timing":0,"End_timing":1104167,"Channel":1,"Voice":1,"Is_chord":true,"Note_position":71,"Note_velocity":110,"Note_pitch_class":"B","Note_octave":4,"Note_duration":480,"Following_rest_duration":0},{"ID":3,"Start_tick":192,"End_tick":352,"Start_timing":500000,"End_timing":916667,"Channel":0,"Voice":0,"Is_chord":false,"Note_position":75,"Note_velocity":110,"Note_pitch_class":"D#","Note_octave":5,"Note_duration":192,"Following_rest_duration":0},{"ID":4,"Start_tick":384,"End_tick":544,"Start_timing":1000000,"End_timing":1416667,"Channel":0,"Voice":0,"Is_chord":false,"Note_position":71,"Note_velocity":110,"Note_pitch_class":"B","Note_octave":4,"Note_duration":192,"Following_rest_duration":0},{"ID":5,"Start_tick":384,"End_tick":544,"Start_timing":1000000,"End_timing":1416667,"Channel":0,"Voice":0,"Is_chord":true,"Note_position":76,"Note_velocity":110,"Note_pitch_class":"E","Note_octave":5,"Note_duration":192,"Following_rest_duration":0},{"ID":6,"Start_tick":480,"End_tick":640,"Start_timing":1250000,"End_timing":1666667,"Channel":1,"Voice":1,"Is_chord":false,"Note_position":69,"Note_velocity":110,"Note_pitch_class":"A","Note_octave":4,"Note_duration":192,"Following_rest_duration":0},{"ID":7,"Start_tick":480,"End_tick":640,"Start_timing":1250000,"End_timing":1666667,"Channel":1,"Voice":1,"Is_chord":true,"Note_position":75,"Note_velocity":110,"Note_pitch_class":"D#","Note_octave":5,"Note_duration":192,"Following_rest_duration":0},{"ID":9,"Start_tick":576,"End_tick":736,"Start_timing":1500000,"End_timing":1916667,"Channel":0,"Voice":0,"Is_chord":false,"Note_position":73,"Note_velocity":110,"Note_pitch_class":"C#","Note_octave":5,"Note_duration":192,"Following_rest_duration":0},{"ID":8,"Start_tick":576,"End_tick":928,"Start_timing":1500000,"End_timing":2416667,"Channel":0,"Voice":2,"Is_chord":false,"Note_position":68,"Note_velocity":110,"Note_pitch_class":"G#","Note_octave":4,"Note_duration":384,"Following_rest_duration":552},{"ID":10,"Start_tick":672,"End_tick":848,"Start_timing":1750000,"End_timing":2208333,"Channel":1,"Voice":1,"Is_chord":false,"Note_position":71,"Note_velocity":110,"Note_pitch_class":"B","Note_octave":4,"Note_duration":192,"Following_rest_duration":0},{"ID":11,"Start_tick":768,"End_tick":1088,"Start_timing":2000000,"End_timing":2833334,"Channel":0,"Voice":0,"Is_chord":false,"Note_position":69,"Note_velocity":110,"Note_pitch_class":"A","Note_octave":4,"Note_duration":384,"Following_rest_duration":192},{"ID":12,"Start_tick":864,"End_tick":944,"Start_timing":2250000,"End_timing":2458334,"Channel":1,"Voice":1,"Is_chord":false,"Note_position":73,"Note_velocity":110,"Note_pitch_class":"C#","Note_octave":5,"Note_duration":96,"Following_rest_duration":0},{"ID":13,"Start_tick":960,"End_tick":1040,"Start_timing":2500001,"End_timing":2708334,"Channel":1,"Voice":1,"Is_chord":false,"Note_position":73,"Note_velocity":110,"Note_pitch_class":"C#","Note_octave":5,"Note_duration":96,"Following_rest_duration":0},{"ID":14,"Start_tick":960,"End_tick":1040,"Start_timing":2500001,"End_timing":2708334,"Channel":1,"Voice":1,"Is_chord":true,"Note_position":75,"Note_velocity":110,"Note_pitch_class":"D#","Note_octave":5,"Note_duration":96,"Following_rest_duration":0},{"ID":15,"Start_tick":1056,"End_tick":1136,"Start_timing":2750001,"End_timing":2958334,"Channel":1,"Voice":1,"Is_chord":false,"Note_position":69,"Note_velocity":110,"Note_pitch_class":"A","Note_octave":4,"Note_duration":96,"Following_rest_duration":360},{"ID":16,"Start_tick":1056,"End_tick":1136,"Start_timing":2750001,"End_timing":2958334,"Channel":1,"Voice":1,"Is_chord":true,"Note_position":73,"Note_velocity":110,"Note_pitch_class":"C#","Note_octave":5,"Note_duration":96,"Following_rest_duration":360},{"ID":17,"Start_tick":1056,"End_tick":1136,"Start_timing":2750001,"End_timing":2958334,"Channel":1,"Voice":1,"Is_chord":true,"Note_position":76,"Note_velocity":110,"Note_pitch_class":"E","Note_octave":5,"Note_duration":96,"Following_rest_duration":360},{"ID":18,"Start_tick":1344,"End_tick":1504,"Start_timing":3500001,"End_timing":3916668,"Channel":0,"Voice":0,"Is_chord":false,"Note_position":71,"Note_velocity":110,"Note_pitch_class":"B","Note_octave":4,"Note_duration":168,"Following_rest_duration":0},{"ID":19,"Start_tick":1344,"End_tick":1504,"Start_timing":3500001,"End_timing":3916668,"Channel":0,"Voice":0,"Is_chord":true,"Note_position":80,"Note_velocity":110,"Note_pitch_class":"G#","Note_octave":5,"Note_duration":168,"Following_rest_duration":0}],"Score":{"Staves":[[{"End_bar":"single","Key_signature":"E","Notations":[{"Type":"clef","Tick":0,"Options":"treble"},{"Type":"key_signature","Tick":0,"Options":"E"},{"Type":"time_signature","Tick":0,"Options":"4/4"},{"Type":"note","Tick":0,"End_tick":192,"IDs":2,"Element_id":"2-0","Channel":0,"Voice":0,"Options":{"clef":"treble","keys":["e/5"],"duration":"4"}},{"Type":"rest","Tick":0,"End_tick":576,"Channel":0,"Voice":0,"Options":{"keys":["b/4"],"duration":"2dr"}},{"Type":"note","Tick":192,"End_tick":384,"IDs":3,"Element_id":"3-192","Channel":0,"Voice":0,"Options":{"clef":"treble","keys":["d#/5"],"duration":"4"}},{"Type":"note","Tick":384,"End_tick":576,"IDs":4,"Element_id":"4-384","Channel":0,"Voice":0,"Options":{"clef":"treble","keys":["b/4","e/5"],"duration":"4"}},{"Type":"note","Tick":576,"End_tick":768,"IDs":9,"Element_id":"9-576","Channel":0,"Voice":0,"Options":{"clef":"treble","keys":["c#/5"],"duration":"4"}}]},{"End_bar":"end","Key_signature":"E","Notations":[{"Type":"note","Tick":768,"End_tick":1152,"IDs":11,"Element_id":"11-768","Channel":0,"Voice":0,"Options":{"clef":"treble","keys":["a/4"],"duration":"2"}},{"Type":"rest","Tick":1152,"End_tick":1344,"Channel":0,"Voice":0,"Options":{"keys":["b/4"],"duration":"4r"}},{"Type":"note","Tick":1344,"End_tick":1512,"IDs":18,"Element_id":"18-1344","Channel":0,"Voice":0,"Options":{"clef":"treble","keys":["b/4","g#/5"],"duration":"8dd"}}]}],[{"End_bar":"single","Key_signature":"E","Notations":[{"Type":"clef","Tick":0,"Options":"treble"},{"Type":"key_signature","Tick":0,"Options":"E"},{"Type":"time_signature","Tick":0,"Options":"4/4"},{"Type":"note","Tick":0,"End_tick":384,"IDs":0,"Element_id":"0-0","Channel":1,"Voice":1,"Options":{"clef":"treble","keys":["g#/4","b/4"],"duration":"2"}},{"Type":"note","Tick":384,"End_tick":480,"IDs":0,"Element_id":"0-384","Channel":1,"Voice":1,"Options":{"keys":["g#/4","b/4"],"duration":"8"}},{"Type":"note","Tick":480,"End_tick":672,"IDs":6,"Element_id":"6-480","Channel":1,"Voice":1,"Options":{"clef":"treble","keys":["a/4","d#/5"],"duration":"4"}},{"Type":"note","Tick":672,"End_tick":768,"IDs":10,"Element_id":"10-672","Channel":1,"Voice":1,"Options":{"clef":"treble","keys":["b/4"],"duration":"8"}}]},{"End_bar":"end","Key_signature":"E","Notations":[{"Type":"note","Tick":768,"End_tick":864,"IDs":10,"Element_id":"10-768","Channel":1,"Voice":1,"Options":{"clef":"treble","keys":["b/4"],"duration":"8"}},{"Type":"note","Tick":864,"End_tick":960,"IDs":12,"Element_id":"12-864","Channel":1,"Voice":1,"Options":{"clef":"treble","keys":["c#/5"],"duration":"8"}},{"Type":"note","Tick":960,"End_tick":1056,"IDs":13,"Element_id":"13-960","Channel":1,"Voice":1,"Options":{"clef":"treble","keys":["c#/5","d#/5"],"duration":"8"}},{"Type":"note","Tick":1056,"End_tick":1152,"IDs":15,"Element_id":"15-1056","Channel":1,"Voice":1,"Options":{"clef":"treble","keys":["a/4","c#/5","e/5"],"duration":"8"}},{"Type":"rest","Tick":1152,"End_tick":1512,"Channel":1,"Voice":1,"Options":{"keys":["b/4"],"duration":"4dddr"}}]}],[{"End_bar":"single","Key_signature":"E","Notations":[{"Type":"clef","Tick":0,"Options":"treble"},{"Type":"key_signature","Tick":0,"Options":"E"},{"Type":"time_signature","Tick":0,"Options":"4/4"},{"Type":"note","Tick":576,"End_tick":768,"IDs":8,"Element_id":"8-576","Channel":0,"Voice":2,"Options":{"clef":"treble","keys":["g#/4"],"duration":"4"}}]},{"End_bar":"end","Key_signature":"E","Notations":[{"Type":"note","Tick":768,"End_tick":960,"IDs":8,"Element_id":"8-768","Channel":0,"Voice":2,"Options":{"clef":"treble","keys":["g#/4"],"duration":"4"}},{"Type":"rest","Tick":960,"End_tick":1344,"Channel":0,"Voice":2,"Options":{"keys":["b/4"],"duration":"2r"}},{"Type":"rest","Tick":1344,"End_tick":1512,"Channel":0,"Voice":2,"Options":{"keys":["b/4"],"duration":"8ddr"}}]}]],"Ties":[{"from":"0-0","to":"0-384","first_indices":[0,1],"last_indices":[0,1]},{"from":"10-672","to":"10-768","first_indices":[0],"last_indices":[0]},{"from":"8-576","to":"8-768","first_indices":[0],"last_indices":[0]}]}
  };
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.createScore();
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
    while (div.hasChildNodes()) {
      div.removeChild(div.firstChild);
    }

    let renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);


    // Configure the rendering context.
    renderer.resize(900, 450);
    let ctx = renderer.getContext();
    ctx.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
    ctx.scale(0.6, 0.6);

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
    
    //ctx.setViewBox(0, 0, x, y);

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
