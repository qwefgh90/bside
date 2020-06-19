import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OAuthServiceChannel } from './o-auth-service-channel';
import { Subject, ReplaySubject } from 'rxjs';
import { CookieToken, Cookie } from 'src/app/db/cookie';

@Injectable({
  providedIn: 'root'
})
export class OAuthService {
  constructor(private httpClient: HttpClient, @Inject(CookieToken) private cookie: Cookie) { 
    this.isLogin = false; 
    // this.intialOAuthInfo();
  }

  isLogin;
  clientId: string;
  accessToken: string;

  private updateLogin(isLogin, accessToken){
    this.isLogin = isLogin;
    this.accessToken = accessToken;
    this.loginSubject.next(isLogin);
  }

  private loginSubject = new ReplaySubject<boolean>(1);
  readonly channel = new OAuthServiceChannel(this.loginSubject);
  
  intialOAuthInfo(): Promise<{state: string, client_id: string}> {
    return this.httpClient
      .get<{state: string, client_id: string}>(`${environment.apiServer}/login/github/initialdata`)
      .toPromise().then(info => {
        this.clientId = info.client_id;
        return info;
      });
  }

  login(state: string, code: string){
    let httpParams = new FormData();
    httpParams.set("state", state);
    httpParams.set("code", code);
    
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this.httpClient
      .post<{access_token: string}>(`${environment.apiServer}/login/github/accesstoken`, httpParams)
      .toPromise().then<void>((value) => {
        this.cookie.autoLogin = true; // when a user sign in or sign out by oneself, update autoLogin true otherwise false.
        this.updateLogin(true, value.access_token);
      });
  }

  logout(){
    return this.httpClient
      .post<void>(`${environment.apiServer}/login/github/logout`, '')
      .toPromise().then<void>(() => {
        this.cookie.autoLogin = false; // when a user sign in or sign out by oneself, update autoLogin true otherwise false.
        this.updateLogin(false, undefined);
      });
  }

  initAccessTokenOnSession() {
    return this.httpClient
      .get<{access_token: string}>(`${environment.apiServer}/login/github/accesstoken`)
      .toPromise().then<void>((value) => {
        this.updateLogin(true, value.access_token);
      }).catch(() => Promise.resolve());
  }

  checkSession(){
    return this.httpClient
      .get<HttpResponse<void>>(`${environment.apiServer}/login/github/ping`, { observe: 'response' })
      .toPromise().then<void>((res) => {
        if(!res.ok)
          this.updateLogin(false, undefined);
      }).catch(() => {
        this.updateLogin(false, undefined);
      });
  }
}
