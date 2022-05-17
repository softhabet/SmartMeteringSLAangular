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
  private coordUrl = 'http://localhost:8180/map-service/map/one';
  private geoUrl = 'http://localhost:8180/map-service/map/geo';

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

  getCoord() {
    return this.http.get(`${this.coordUrl}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(errorRes => {
        return throwError(errorRes);
      })
    );
  }

  getGeo() {
    return this.http.get(`${this.geoUrl}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(errorRes => {
        return throwError(errorRes);
      })
    );
  }
}
