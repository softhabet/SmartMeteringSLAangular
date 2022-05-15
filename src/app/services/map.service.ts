import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Icoord {
  dcNumber: string;
  meterLat: number;
  meterLng: number;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private coordsUrl = 'http://localhost:8180/map-service/map/all';

  constructor(private http: HttpClient) { }

  getCoords() {
    return this.http.get(`${this.coordsUrl}`).pipe(
      map((res: Icoord[]) => {
        return res;
      }),
      catchError(errorRes => {
        return throwError(errorRes);
      })
    );
  }
}
