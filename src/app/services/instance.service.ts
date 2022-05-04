import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
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
  private setInstanceSizeUrl = 'http://localhost:8180/report-generation-service/instances/size';
  private exportCSVUrl = 'http://localhost:8180/report-generation-service/instances/export-csv';
  private exportPDFUrl = 'http://localhost:8180/report-generation-service/instances/export-pdf';
  private exportXLSXUrl = 'http://localhost:8180/report-generation-service/instances/export-xlsx';
  private deleteInstanceUrl = 'http://localhost:8180/report-generation-service/instances';

  constructor(private http: HttpClient) { }

  getinstances(pageSize: number = 10, currentPage: number = 0, searchName: string = '', searchReport: string = '', type: string = '') {
    const url = this.instanceListUrl;
    let params = new HttpParams();
    params = params.append('size', pageSize + '');
    params = params.append('page', currentPage + '');
    if (searchReport !== '' && searchReport !== null) {
      params = params.append('searchReport', searchReport);
    }
    if (searchName !== '' && searchName !== null) {
      params = params.append('searchName', searchName);
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

  exportCSV(id: number): Observable<any> {
    return this.http.get(`${this.exportCSVUrl}/${id}`, {observe: 'response', responseType: 'blob'});
  }

  exportPDF(id: number): Observable<any> {
    return this.http.get(`${this.exportPDFUrl}/${id}`, {observe: 'response', responseType: 'blob'});
  }

  exportExcel(id: number): Observable<any> {
    return this.http.get(`${this.exportXLSXUrl}/${id}`, {observe: 'response', responseType: 'blob'});
  }

  setInstanceSize(id: number, size: number) {
    return this.http.get(`${this.setInstanceSizeUrl}/${id}/${size}`, {responseType: 'text'});
  }

  deleteInstance(id: number) {
    return this.http.delete(`${this.deleteInstanceUrl}/${id}`, { responseType: 'text' });
  }
}
