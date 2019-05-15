import { Component, OnInit, InjectionToken, Inject } from '@angular/core';
import { OAuthService } from '../service/o-auth.service';
import { environment } from 'src/environments/environment';

export const LOCATION_TOKEN = new InjectionToken<Location>('Window location object');

export enum LoginStatus{
  Loading, Failure, Initialized
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  LoginStatus = LoginStatus;
  client_id: string;
  state: string;
  redirect_uri: string;
  status: LoginStatus = LoginStatus.Loading;
  
  includingPrivate = false;
  constructor(private oauthService: OAuthService, @Inject(LOCATION_TOKEN) private location: Location) { 
  }

  ngOnInit() {
    const oauthInfo = this.oauthService.intialOAuthInfo(); 
    oauthInfo.then((info) => {
      this.state = info.state;
      this.client_id = info.client_id;
      this.status = LoginStatus.Initialized;
    }, (reason) => {
      this.status = LoginStatus.Failure;
      console.error("We cannot get initial information from server.")
    })
    this.redirect_uri = this.makeRedirectUrl();
  }

  makeRedirectUrl(){
    return `${environment.redirect_url}?route=${this.oauthService.redirectUrl ? this.oauthService.redirectUrl : ''}`;
  }

  login(){
    let scope = this.includingPrivate ?  'repo' : 'public_repo'
    let authroizeUrl = `${environment.authorizeOriginUrl}?client_id=${this.client_id}&state=${this.state}&scope=${scope}&redirect_uri=${this.redirect_uri}`;
    this.location.assign(authroizeUrl);
  }
}
