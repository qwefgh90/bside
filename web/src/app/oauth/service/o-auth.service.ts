import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OAuthService {
  constructor(private httpClient: HttpClient) { }
  isLogin = false;
  accessToken;
  intialOAuthInfo(): Promise<{state: string, client_id: string}> {
    return this.httpClient
      .get<{state: string, client_id: string}>(`${environment.apiServer}/login/github/initialdata`)
      .toPromise();
  }

  makeAccessToken(state: string, code: string){
    let httpParams = new FormData();
    httpParams.set("state", state);
    httpParams.set("code", code);
    
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this.httpClient
      .post<{access_token: string}>(`${environment.apiServer}/login/github/accesstoken`, httpParams)
      .toPromise().then((value) => {
        this.isLogin = true;
        this.accessToken = value.access_token;
        return value;
      });
  }
}
