import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, ReplaySubject, Observable } from 'rxjs';
import { CookieToken, Cookie } from 'src/app/db/cookie';
import { Store, createFeatureSelector, select, createSelector } from '@ngrx/store';
import { signIn } from '../auth.actions';
import { authReducerKey, AuthState } from '../auth.reducer';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OAuthService {
  constructor(private httpClient: HttpClient, @Inject(CookieToken) private cookie: Cookie, private store: Store<{}>) {
    let selector = createFeatureSelector(authReducerKey);
    let accessToken$ = this.store.pipe(select(createSelector(selector, (state: AuthState) => state.accessToken)));
    // this.intialOAuthInfo();
  }

  clientId: string;

  private updateLogin(accessToken) {
    this.store.dispatch(signIn({accessToken}));
  }

  intialOAuthInfo(): Promise<{ state: string, client_id: string }> {
    return this.httpClient
      .get<{ state: string, client_id: string }>(`${environment.apiServer}/login/github/initialdata`)
      .toPromise().then(info => {
        this.clientId = info.client_id;
        return info;
      });
  }

  login(state: string, code: string) {
    let httpParams = new FormData();
    httpParams.set("state", state);
    httpParams.set("code", code);

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this.httpClient
      .post<{ access_token: string }>(`${environment.apiServer}/login/github/accesstoken`, httpParams)
      .toPromise().then<void>((value) => {
        this.cookie.autoLogin = true; // when a user sign in or sign out by oneself, update autoLogin true otherwise false.
        this.updateLogin(value.access_token);
      });
  }

  logout() {
    return this.httpClient
      .post<void>(`${environment.apiServer}/login/github/logout`, '')
      .toPromise().then<void>(() => {
        this.cookie.autoLogin = false; // when a user sign in or sign out by oneself, update autoLogin true otherwise false.
        this.updateLogin(undefined);
      });
  }

  initAccessTokenOnSession() {
    return this.httpClient
      .get<{ access_token: string }>(`${environment.apiServer}/login/github/accesstoken`)
      .toPromise().then<void>((value) => {
        this.updateLogin(value.access_token);
      }).catch(() => Promise.resolve());
  }

  checkSession() {
    return this.httpClient
      .get<HttpResponse<void>>(`${environment.apiServer}/login/github/ping`, { observe: 'response' })
      .toPromise().then<void>((res) => {
        if (!res.ok)
          this.updateLogin(undefined);
      }).catch(() => {
        this.updateLogin(undefined);
      });
  }
}
