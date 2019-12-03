import { IMusic } from './music';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

@Injectable()
export class FilelistService {

    private _url: string = '/assets/processed/';
    private _file: string = 'alb_esp1.json';
    private _url2: string = '';
    constructor(private http: HttpClient) { }

    getMusic(file): Observable<IMusic[]> {
        if (file) {
            this._file = file + '.json';
        }
        this._url2 = (this._url + this._file).toString();
        return this.http.get<IMusic[]>(this._url2);
    }
}