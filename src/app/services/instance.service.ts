import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';


export interface IInstanceInfo {
  instanceId: string;
  reportInstanceFileName: string;
  reportName: string;
  reportType: string;
  creationDate: string;
  reportSize: number;
  lineCount: number;
  isCompressed: boolean;
  status: string;
}

export interface IInstanceListResponse {
  totalItems: number;
  instancesList: IInstanceInfo[];
  totalPages: number;
  pageSize: number;
  currentPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class InstanceService {

  private instanceListUrl = 'http://localhost:8180/report-generation-service/instances/info';

  constructor(private http: HttpClient) { }

  getinstances(pageSize: number = 10, currentPage: number = 0, name: string = '', type: string = '') {
    const url = this.instanceListUrl;
    let params = new HttpParams();
    params = params.append('size', pageSize + '');
    params = params.append('page', currentPage + '');
    if (name !== '' && name !== null) {
      params = params.append('name', name);
    }
    if (type === 'METER' || type === 'EVENT') {
      params = params.append('type', type);
    }
    return this.http.get(url, { params })
      .pipe(
        map((res: IInstanceListResponse) => {
          return res;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }
}
