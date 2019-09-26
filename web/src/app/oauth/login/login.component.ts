import { Component, OnInit, InjectionToken, Inject } from '@angular/core';
import { OAuthService } from '../service/o-auth.service';
import { environment } from 'src/environments/environment';
import { TextUtil } from 'src/app/workspace/text/text-util';
import { ActivatedRoute } from '@angular/router';
import { CookieToken, Cookie } from 'src/app/db/cookie';
import { MatCheckboxChange } from '@angular/material';

export const LOCATION_TOKEN = new InjectionToken<Location>('Window location object');
const SCOPE_KEY = "includingPrivate"

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

  autoLogin = false;
  includingPrivate = false;
  constructor(private oauthService: OAuthService, @Inject(LOCATION_TOKEN) private location: Location, private route: ActivatedRoute
  , @Inject(CookieToken) private cookie: Cookie) { 
  }

  ngOnInit() {
    if(this.route.snapshot.queryParamMap.has('private')){
      this.includingPrivate = this.route.snapshot.queryParamMap.get('private') == "true";
    }
    if(this.route.snapshot.queryParamMap.has('autoLogin')){
      this.autoLogin = this.route.snapshot.queryParamMap.get('autoLogin') == "true";
    }
    const oauthInfo = this.oauthService.intialOAuthInfo(); 
    oauthInfo.then((info) => {
      if(info == undefined){
        this.status = LoginStatus.Failure;
        console.error("We cannot get initial information from server.");
      }else{
        this.state = info.state;
        this.client_id = info.client_id;
        this.status = LoginStatus.Initialized;
        if(this.autoLogin)
          this.login();
      }
    }, (reason) => {
      this.status = LoginStatus.Failure;
      console.error("We cannot get initial information from server.", reason)
    })
    this.redirect_uri = this.makeRedirectUrl();
  }

  makeRedirectUrl(){
    return `${environment.redirect_url}?route=${this.oauthService.redirectUrl ? TextUtil.stringToBase64(this.oauthService.redirectUrl) : ''}`;
  }

  changeScope(event: MatCheckboxChange){
    this.cookie.includingPrivate = event.checked;
  }

  login(){
    let scope = this.includingPrivate ?  'repo' : 'public_repo'
    let authroizeUrl = `${environment.authorizeOriginUrl}?client_id=${this.client_id}&state=${this.state}&scope=${scope}&redirect_uri=${this.redirect_uri}`;
    this.location.assign(authroizeUrl);
  }
}
