import { Component, OnInit, NgModule, Renderer2, Inject, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

declare var MIDI:any;
declare var eventjs:any;
declare var sketch:any;

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


  // MIDI files from Disklavier World
  public songid = 0;
  public song = ['../../assets/midi_data/albeniz/alb_esp1.mid', '../../assets/midi_data/albeniz/alb_esp2.mid', '../../assets/midi_data/albeniz/alb_esp3.mid', '../../assets/midi_data/albeniz/alb_esp4.mid', '../../assets/midi_data/albeniz/alb_esp5.mid', '../../assets/midi_data/albeniz/alb_esp6.mid', '../../assets/midi_data/albeniz/alb_se1.mid', '../../assets/midi_data/albeniz/alb_se2.mid', '../../assets/midi_data/albeniz/alb_se3.mid', '../../assets/midi_data/albeniz/alb_se4.mid', '../../assets/midi_data/albeniz/alb_se5.mid', '../../assets/midi_data/albeniz/alb_se6.mid', '../../assets/midi_data/albeniz/alb_se7.mid', '../../assets/midi_data/albeniz/alb_se8.mid', '../../assets/midi_data/bach/bach_846.mid', '../../assets/midi_data/bach/bach_847.mid', '../../assets/midi_data/bach/bach_850.mid', '../../assets/midi_data/balakir/islamei.mid', '../../assets/midi_data/beeth/appass_1.mid', '../../assets/midi_data/beeth/appass_2.mid', '../../assets/midi_data/beeth/appass_3.mid', '../../assets/midi_data/beeth/beethoven_hammerklavier_1.mid', '../../assets/midi_data/beeth/beethoven_hammerklavier_2.mid', '../../assets/midi_data/beeth/beethoven_hammerklavier_3.mid', '../../assets/midi_data/beeth/beethoven_hammerklavier_4.mid', '../../assets/midi_data/beeth/beethoven_les_adieux_1.mid', '../../assets/midi_data/beeth/beethoven_les_adieux_2.mid', '../../assets/midi_data/beeth/beethoven_les_adieux_3.mid', '../../assets/midi_data/beeth/beethoven_opus10_1.mid', '../../assets/midi_data/beeth/beethoven_opus10_2.mid', '../../assets/midi_data/beeth/beethoven_opus10_3.mid', '../../assets/midi_data/beeth/beethoven_opus22_1.mid', '../../assets/midi_data/beeth/beethoven_opus22_2.mid', '../../assets/midi_data/beeth/beethoven_opus22_3.mid', '../../assets/midi_data/beeth/beethoven_opus22_4.mid', '../../assets/midi_data/beeth/beethoven_opus90_1.mid', '../../assets/midi_data/beeth/beethoven_opus90_2.mid', '../../assets/midi_data/beeth/elise.mid', '../../assets/midi_data/beeth/mond_1.mid', '../../assets/midi_data/beeth/mond_2.mid', '../../assets/midi_data/beeth/mond_3.mid', '../../assets/midi_data/beeth/pathetique_1.mid', '../../assets/midi_data/beeth/pathetique_2.mid', '../../assets/midi_data/beeth/pathetique_3.mid', '../../assets/midi_data/beeth/waldstein_1.mid', '../../assets/midi_data/beeth/waldstein_2.mid', '../../assets/midi_data/beeth/waldstein_3.mid', '../../assets/midi_data/borodin/bor_ps1.mid', '../../assets/midi_data/borodin/bor_ps2.mid', '../../assets/midi_data/borodin/bor_ps3.mid', '../../assets/midi_data/borodin/bor_ps4.mid', '../../assets/midi_data/borodin/bor_ps5.mid', '../../assets/midi_data/borodin/bor_ps6.mid', '../../assets/midi_data/borodin/bor_ps7.mid', '../../assets/midi_data/brahms/brahms_opus117_1.mid', '../../assets/midi_data/brahms/brahms_opus117_2.mid', '../../assets/midi_data/brahms/brahms_opus1_1.mid', '../../assets/midi_data/brahms/brahms_opus1_2.mid', '../../assets/midi_data/brahms/brahms_opus1_3.mid', '../../assets/midi_data/brahms/brahms_opus1_4.mid', '../../assets/midi_data/brahms/br_im2.mid', '../../assets/midi_data/brahms/br_im5.mid', '../../assets/midi_data/brahms/BR_IM6.MID', '../../assets/midi_data/brahms/br_rhap.mid', '../../assets/midi_data/burgm/burg_agitato.mid', '../../assets/midi_data/burgm/burg_erwachen.mid', '../../assets/midi_data/burgm/burg_geschwindigkeit.mid', '../../assets/midi_data/burgm/burg_gewitter.mid', '../../assets/midi_data/burgm/burg_perlen.mid', '../../assets/midi_data/burgm/burg_quelle.mid', '../../assets/midi_data/burgm/burg_spinnerlied.mid', '../../assets/midi_data/burgm/burg_sylphen.mid', '../../assets/midi_data/burgm/burg_trennung.mid', '../../assets/midi_data/chopin/chpn_op10_e01.mid', '../../assets/midi_data/chopin/chpn_op10_e05.mid', '../../assets/midi_data/chopin/chpn_op10_e12.mid', '../../assets/midi_data/chopin/chpn_op23.mid', '../../assets/midi_data/chopin/chpn_op25_e11.mid', '../../assets/midi_data/chopin/chpn_op25_e12.mid', '../../assets/midi_data/chopin/chpn_op25_e1.mid', '../../assets/midi_data/chopin/chpn_op25_e2.mid', '../../assets/midi_data/chopin/chpn_op25_e3.mid', '../../assets/midi_data/chopin/chpn_op25_e4.mid', '../../assets/midi_data/chopin/chpn_op27_1.mid', '../../assets/midi_data/chopin/chpn_op27_2.mid', '../../assets/midi_data/chopin/chpn_op33_2.mid', '../../assets/midi_data/chopin/chpn_op33_4.mid', '../../assets/midi_data/chopin/chpn_op35_1.mid', '../../assets/midi_data/chopin/chpn_op35_2.mid', '../../assets/midi_data/chopin/chpn_op35_3.mid', '../../assets/midi_data/chopin/chpn_op35_4.mid', '../../assets/midi_data/chopin/chpn_op53.mid', '../../assets/midi_data/chopin/chpn_op66.mid', '../../assets/midi_data/chopin/chpn_op7_1.mid', '../../assets/midi_data/chopin/chpn_op7_2.mid', '../../assets/midi_data/chopin/chpn-p10.mid', '../../assets/midi_data/chopin/chpn-p11.mid', '../../assets/midi_data/chopin/chpn-p12.mid', '../../assets/midi_data/chopin/chpn-p13.mid', '../../assets/midi_data/chopin/chpn-p14.mid', '../../assets/midi_data/chopin/chpn-p15.mid', '../../assets/midi_data/chopin/chpn-p16.mid', '../../assets/midi_data/chopin/chpn-p17.mid', '../../assets/midi_data/chopin/chpn-p18.mid', '../../assets/midi_data/chopin/chpn-p19.mid', '../../assets/midi_data/chopin/chpn-p1.mid', '../../assets/midi_data/chopin/chpn-p20.mid', '../../assets/midi_data/chopin/chpn-p21.mid', '../../assets/midi_data/chopin/chpn-p22.mid', '../../assets/midi_data/chopin/chpn-p23.mid', '../../assets/midi_data/chopin/chpn-p24.mid', '../../assets/midi_data/chopin/chpn-p2.mid', '../../assets/midi_data/chopin/chpn-p3.mid', '../../assets/midi_data/chopin/chpn-p4.mid', '../../assets/midi_data/chopin/chpn-p5.mid', '../../assets/midi_data/chopin/chpn-p6.mid', '../../assets/midi_data/chopin/chpn-p7.mid', '../../assets/midi_data/chopin/chpn-p8.mid', '../../assets/midi_data/chopin/chpn-p9.mid', '../../assets/midi_data/chopin/chp_op18.mid', '../../assets/midi_data/chopin/chp_op31.mid', '../../assets/midi_data/debussy/DEB_CLAI.MID', '../../assets/midi_data/debussy/deb_menu.mid', '../../assets/midi_data/debussy/DEB_PASS.MID', '../../assets/midi_data/debussy/deb_prel.mid', '../../assets/midi_data/debussy/debussy_cc_1.mid', '../../assets/midi_data/debussy/debussy_cc_2.mid', '../../assets/midi_data/debussy/debussy_cc_3.mid', '../../assets/midi_data/debussy/debussy_cc_4.mid', '../../assets/midi_data/debussy/debussy_cc_6.mid', '../../assets/midi_data/granados/gra_esp_2.mid', '../../assets/midi_data/granados/gra_esp_3.mid', '../../assets/midi_data/granados/gra_esp_4.mid', '../../assets/midi_data/grieg/grieg_album.mid', '../../assets/midi_data/grieg/grieg_berceuse.mid', '../../assets/midi_data/grieg/grieg_brooklet.mid', '../../assets/midi_data/grieg/grieg_butterfly.mid', '../../assets/midi_data/grieg/grieg_elfentanz.mid', '../../assets/midi_data/grieg/grieg_halling.mid', '../../assets/midi_data/grieg/grieg_kobold.mid', '../../assets/midi_data/grieg/grieg_march.mid', '../../assets/midi_data/grieg/grieg_once_upon_a_time.mid', '../../assets/midi_data/grieg/grieg_spring.mid', '../../assets/midi_data/grieg/grieg_voeglein.mid', '../../assets/midi_data/grieg/grieg_waechter.mid', '../../assets/midi_data/grieg/grieg_walzer.mid', '../../assets/midi_data/grieg/grieg_wanderer.mid', '../../assets/midi_data/grieg/grieg_wedding.mid', '../../assets/midi_data/grieg/grieg_zwerge.mid', '../../assets/midi_data/haydn/hay_40_1.mid', '../../assets/midi_data/haydn/hay_40_2.mid', '../../assets/midi_data/haydn/haydn_33_1.mid', '../../assets/midi_data/haydn/haydn_33_2.mid', '../../assets/midi_data/haydn/haydn_33_3.mid', '../../assets/midi_data/haydn/haydn_35_1.mid', '../../assets/midi_data/haydn/haydn_35_2.mid', '../../assets/midi_data/haydn/haydn_35_3.mid', '../../assets/midi_data/haydn/haydn_43_1.mid', '../../assets/midi_data/haydn/haydn_43_2.mid', '../../assets/midi_data/haydn/haydn_43_3.mid', '../../assets/midi_data/haydn/haydn_7_1.mid', '../../assets/midi_data/haydn/haydn_7_2.mid', '../../assets/midi_data/haydn/haydn_7_3.mid', '../../assets/midi_data/haydn/haydn_8_1.mid', '../../assets/midi_data/haydn/haydn_8_2.mid', '../../assets/midi_data/haydn/haydn_8_3.mid', '../../assets/midi_data/haydn/haydn_8_4.mid', '../../assets/midi_data/haydn/haydn_9_1.mid', '../../assets/midi_data/haydn/haydn_9_2.mid', '../../assets/midi_data/haydn/haydn_9_3.mid', '../../assets/midi_data/liszt/liz_donjuan.mid', '../../assets/midi_data/liszt/liz_et1.mid', '../../assets/midi_data/liszt/liz_et2.mid', '../../assets/midi_data/liszt/liz_et3.mid', '../../assets/midi_data/liszt/liz_et4.mid', '../../assets/midi_data/liszt/liz_et5.mid', '../../assets/midi_data/liszt/liz_et6.mid', '../../assets/midi_data/liszt/liz_et_trans4.mid', '../../assets/midi_data/liszt/liz_et_trans5.mid', '../../assets/midi_data/liszt/liz_et_trans8.mid', '../../assets/midi_data/liszt/liz_liebestraum.mid', '../../assets/midi_data/liszt/liz_rhap02.mid', '../../assets/midi_data/liszt/liz_rhap09.mid', '../../assets/midi_data/liszt/liz_rhap10.mid', '../../assets/midi_data/liszt/liz_rhap12.mid', '../../assets/midi_data/liszt/liz_rhap15.mid', '../../assets/midi_data/mendelssohn/mendel_op19_1.mid', '../../assets/midi_data/mendelssohn/mendel_op19_2.mid', '../../assets/midi_data/mendelssohn/mendel_op19_3.mid', '../../assets/midi_data/mendelssohn/mendel_op19_4.mid', '../../assets/midi_data/mendelssohn/mendel_op19_5.mid', '../../assets/midi_data/mendelssohn/mendel_op19_6.mid', '../../assets/midi_data/mendelssohn/mendel_op30_1.mid', '../../assets/midi_data/mendelssohn/mendel_op30_2.mid', '../../assets/midi_data/mendelssohn/mendel_op30_3.mid', '../../assets/midi_data/mendelssohn/mendel_op30_4.mid', '../../assets/midi_data/mendelssohn/mendel_op30_5.mid', '../../assets/midi_data/mendelssohn/mendel_op53_5.mid', '../../assets/midi_data/mendelssohn/mendel_op62_3.mid', '../../assets/midi_data/mendelssohn/mendel_op62_4.mid', '../../assets/midi_data/mendelssohn/mendel_op62_5.mid', '../../assets/midi_data/mozart/mz_311_1.mid', '../../assets/midi_data/mozart/mz_311_2.mid', '../../assets/midi_data/mozart/mz_311_3.mid', '../../assets/midi_data/mozart/mz_330_1.mid', '../../assets/midi_data/mozart/mz_330_2.mid', '../../assets/midi_data/mozart/mz_330_3.mid', '../../assets/midi_data/mozart/mz_331_1.mid', '../../assets/midi_data/mozart/mz_331_2.mid', '../../assets/midi_data/mozart/mz_331_3.mid', '../../assets/midi_data/mozart/mz_332_1.mid', '../../assets/midi_data/mozart/mz_332_2.mid', '../../assets/midi_data/mozart/mz_332_3.mid', '../../assets/midi_data/mozart/mz_333_1.mid', '../../assets/midi_data/mozart/mz_333_2.mid', '../../assets/midi_data/mozart/mz_333_3.mid', '../../assets/midi_data/mozart/mz_545_1.mid', '../../assets/midi_data/mozart/mz_545_2.mid', '../../assets/midi_data/mozart/mz_545_3.mid', '../../assets/midi_data/mozart/mz_570_1.mid', '../../assets/midi_data/mozart/mz_570_2.mid', '../../assets/midi_data/mozart/mz_570_3.mid', '../../assets/midi_data/muss/muss_1.mid', '../../assets/midi_data/muss/muss_2.mid', '../../assets/midi_data/muss/muss_3.mid', '../../assets/midi_data/muss/muss_4.mid', '../../assets/midi_data/muss/muss_5.mid', '../../assets/midi_data/muss/muss_6.mid', '../../assets/midi_data/muss/muss_7.mid', '../../assets/midi_data/muss/muss_8.mid', '../../assets/midi_data/schubert/schu_143_1.mid', '../../assets/midi_data/schubert/schu_143_2.mid', '../../assets/midi_data/schubert/schu_143_3.mid', '../../assets/midi_data/schubert/schub_d760_1.mid', '../../assets/midi_data/schubert/schub_d760_2.mid', '../../assets/midi_data/schubert/schub_d760_3.mid', '../../assets/midi_data/schubert/schub_d760_4.mid', '../../assets/midi_data/schubert/schub_d960_1.mid', '../../assets/midi_data/schubert/schub_d960_2.mid', '../../assets/midi_data/schubert/schub_d960_3.mid', '../../assets/midi_data/schubert/schub_d960_4.mid', '../../assets/midi_data/schubert/schubert_D850_1.mid', '../../assets/midi_data/schubert/schubert_D850_2.mid', '../../assets/midi_data/schubert/schubert_D850_3.mid', '../../assets/midi_data/schubert/schubert_D850_4.mid', '../../assets/midi_data/schubert/schubert_D935_1.mid', '../../assets/midi_data/schubert/schubert_D935_2.mid', '../../assets/midi_data/schubert/schubert_D935_3.mid', '../../assets/midi_data/schubert/schubert_D935_4.mid', '../../assets/midi_data/schubert/schuim-1.mid', '../../assets/midi_data/schubert/schuim-2.mid', '../../assets/midi_data/schubert/schuim-3.mid', '../../assets/midi_data/schubert/schuim-4.mid', '../../assets/midi_data/schubert/schumm-1.mid', '../../assets/midi_data/schubert/schumm-2.mid', '../../assets/midi_data/schubert/schumm-3.mid', '../../assets/midi_data/schubert/schumm-4.mid', '../../assets/midi_data/schubert/schumm-5.mid', '../../assets/midi_data/schubert/schumm-6.mid', '../../assets/midi_data/schumann/schum_abegg.mid', '../../assets/midi_data/schumann/scn15_10.mid', '../../assets/midi_data/schumann/scn15_11.mid', '../../assets/midi_data/schumann/scn15_12.mid', '../../assets/midi_data/schumann/scn15_13.mid', '../../assets/midi_data/schumann/scn15_1.mid', '../../assets/midi_data/schumann/scn15_2.mid', '../../assets/midi_data/schumann/scn15_3.mid', '../../assets/midi_data/schumann/scn15_4.mid', '../../assets/midi_data/schumann/scn15_5.mid', '../../assets/midi_data/schumann/scn15_6.mid', '../../assets/midi_data/schumann/scn15_7.mid', '../../assets/midi_data/schumann/scn15_8.mid', '../../assets/midi_data/schumann/scn15_9.mid', '../../assets/midi_data/schumann/scn16_1.mid', '../../assets/midi_data/schumann/scn16_2.mid', '../../assets/midi_data/schumann/scn16_3.mid', '../../assets/midi_data/schumann/scn16_4.mid', '../../assets/midi_data/schumann/scn16_5.mid', '../../assets/midi_data/schumann/scn16_6.mid', '../../assets/midi_data/schumann/scn16_7.mid', '../../assets/midi_data/schumann/scn16_8.mid', '../../assets/midi_data/schumann/scn68_10.mid', '../../assets/midi_data/schumann/scn68_12.mid', '../../assets/midi_data/tschai/ty_april.mid', '../../assets/midi_data/tschai/ty_august.mid', '../../assets/midi_data/tschai/ty_dezember.mid', '../../assets/midi_data/tschai/ty_februar.mid', '../../assets/midi_data/tschai/ty_januar.mid', '../../assets/midi_data/tschai/ty_juli.mid', '../../assets/midi_data/tschai/ty_juni.mid', '../../assets/midi_data/tschai/ty_maerz.mid', '../../assets/midi_data/tschai/ty_mai.mid', '../../assets/midi_data/tschai/ty_november.mid', '../../assets/midi_data/tschai/ty_oktober.mid', '../../assets/midi_data/tschai/ty_september.mid'];

  /// Toggle between Pause and Play modes
  pausePlayStop (stop:any) {
    var d:any = document.getElementById("pausePlayStop");
    if (stop) {
      MIDI.player.stop();
      d.src = "../../assets/dongmoon_images/play.png";
    } else if (MIDI.player.isPlaying) {
      d.src = "../../assets/dongmoon_images/play.png";
      MIDI.player.pause(true);
    } else {
      d.src = "../../assets/dongmoon_images/pause.png";
      MIDI.player.play();
    }
  };

  MIDIPlayerPercentage (player:any) {
    // update the timestamp
    var time1 = document.getElementById("time1");
    var time2 = document.getElementById("time2");
    var capsule = document.getElementById("capsule");
    var timeCursor = document.getElementById("cursor");
    //
    eventjs.add(capsule, "drag", function(event, self) {
      eventjs.cancel(event);
      player.currentTime = (self.x) / 420 * player.duration;
      if (player.currentTime < 0) player.currentTime = 0;
      if (player.currentTime > player.duration) player.currentTime = player.duration;
      if (self.state === "down") {
        player.pause(true);
      } else if (self.state === "up") {
        player.play();
      }
    });
    //
    function timeFormatting(n) {
      var minutes = n / 60 >> 0;
      var seconds = String(n - (minutes * 60) >> 0);
      if (seconds.length == 1) seconds = "0" + seconds;
      return minutes + ":" + seconds;
    };
    player.getNextSong = function(n) {
      var id = Math.abs((this.songid += n) % this.song.length);
      player.loadFile(this.song[this.songid], player.start);
    };
    player.setAnimation(function(event, element) {
      var progress = event.progress;
      var currentTime = event.currentTime >> 0; // where we are now
      var duration = event.duration >> 0; // end of song
      ///
      if (currentTime === duration) { // go to next song
        var id = ++this.songid % this.song.length;
        player.loadFile(this.song[this.songid], player.start);
      }
      ///
      timeCursor.style.width = (progress * 100) + "%";
      time1.innerHTML = timeFormatting(currentTime);
      time2.innerHTML = "-" + timeFormatting(duration - currentTime);
    });
  };


  ngOnInit() {
    console.log (MIDI);
    eventjs.add(window, "load", function(event:any) {
    
      MIDI.loader = new sketch.ui.Timer;
      MIDI.loadPlugin({
        soundfontUrl: "../../assets/dongmoon_soundfonts/",
        onprogress: function(state, progress) {
          MIDI.loader.setValue(progress * 100);
        },
        onsuccess: function() {
  
          /// this sets up the MIDI.player and gets things going...
          var player = MIDI.player;
          player.timeWarp = 1; // speed the song is played back
          player.loadFile(this.song[this.songid++ % this.song.length], player.start);
  
          this.MIDIPlayerPercentage(player);
        }
      });
    });

  }
  
  ngAfterViewInit () {
    console.log (MIDI);
  }
  

}