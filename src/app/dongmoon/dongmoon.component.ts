import { Component, OnInit, NgModule, Renderer2, Inject, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-dongmoon',
  templateUrl: './dongmoon.component.html',
  styleUrls: ['./dongmoon.component.css']
})
export class DongmoonComponent implements OnInit, AfterViewInit {

  constructor(
    private renderer2: Renderer2,
    @Inject (DOCUMENT) private _document
  ) {
  }

  ngOnInit() {
    // load .js files

    const js_files = ["./../assets/dongmoon_sources/Base64.js", "./../assets/dongmoon_sources/Base64binary.js", "./../assets/dongmoon_sources/WebAudioAPI.js", "./../assets/dongmoon_sources/WebMIDIAPI.js", "./../assets/dongmoon_sources/stream.js", "./../assets/dongmoon_sources/midifile.js", "./../assets/dongmoon_sources/replayer.js", "./../assets/dongmoon_sources/audioDetect.js", "./../assets/dongmoon_sources/gm.js", "./../assets/dongmoon_sources/loader.js", "./../assets/dongmoon_sources/plugin.audiotag.js", "./../assets/dongmoon_sources/plugin.webaudio.js", "./../assets/dongmoon_sources/plugin.webmidi.js", "./../assets/dongmoon_sources/player.js", "./../assets/dongmoon_sources/synesthesia.js", "./../assets/dongmoon_sources/dom_request_xhr.js", "./../assets/dongmoon_sources/dom_request_script.js", "./../assets/dongmoon_sources/timer.js", "./../assets/dongmoon_sources/colorspace.js", "./../assets/dongmoon_sources/event.js", "./../assets/dongmoon_sources/main.js"];
    // const js_files = ["./../assets/dongmoon_sources/full.js"];
    for (var i = 0; i < js_files.length; i++) {
      let script = this.renderer2.createElement ('script');
      script.type = 'text/javascript';
      script.src = js_files[i];  
      script.text = ``;
      script.async = false;
      script.charset = 'utf-8';
      this.renderer2.appendChild (this._document.body, script);
    }

  }

  ngAfterViewInit () {
  }

  

}
