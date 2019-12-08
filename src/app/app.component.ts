import { IMusic } from './music';
import { FilelistService } from './filelist.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import file_list from '../../Preprocessing/preprocessed/file_list.json';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'infovisproj';
  public files = file_list;
  public appData = '';
  public receivedData: IMusic;
  // public receivedNotes: Array<any> = [];

  constructor(private _filelistService: FilelistService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  public appendStatus(d) {
    d.Notes.forEach(d => {
      d.State = { selected: true, hovered: false, playing: false };
    });
  }

  public updateData($event) {
    this.appData = $event;
    this._filelistService.getMusic($event)
      .subscribe((data: any) => {
        let d = data;
        this.appendStatus(d);
        this.receivedData = d;
    });
  }
}