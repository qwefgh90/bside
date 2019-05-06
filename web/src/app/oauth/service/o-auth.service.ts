import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OAuthService {
  constructor(private httpClient: HttpClient) { }
  isLogin = false;
  intialOAuthInfo(): Promise<{state: string, client_id: string}> {
    return this.httpClient
      .get<{state: string, client_id: string}>(`${environment.apiServer}/oauth/init`)
      .toPromise();
  }
}
