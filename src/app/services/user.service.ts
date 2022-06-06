import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userNameUrl = 'http://localhost:8180/authentication-service/admins/userName';

  constructor(private http: HttpClient) { }

  getUserName(id: number) {
    return this.http.get(`${this.userNameUrl}/${id}`).pipe(
      map((res: any) => {
        return res.userName;
      }),
      catchError(errorRes => {
        return throwError(errorRes);
      })
    );
  }
}
