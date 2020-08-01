import { Component, OnInit, InjectionToken, Inject } from '@angular/core';
import { OAuthService } from '../service/o-auth.service';
import { environment } from 'src/environments/environment';
import { TextUtil } from 'src/app/workspace/text/text-util';
import { ActivatedRoute } from '@angular/router';
import { CookieToken, Cookie } from 'src/app/db/cookie';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { navigateHere, scopeChanged } from '../auth.actions';
import { Store, createFeatureSelector, createSelector, select } from '@ngrx/store';
import { AuthState, authReducerKey } from '../auth.reducer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  //syncing is not required
  client_id: string;
  state: string;
  status: LoginStatus = LoginStatus.Loading;
  //cache for UI with ngrx
  autoLogin: boolean;
  includingPrivate: boolean;
  redirectUrl: string;
  constructor(private oauthService: OAuthService, @Inject(LOCATION_TOKEN) private location: Location, private route: ActivatedRoute
  , @Inject(CookieToken) private cookie: Cookie, private store: Store<{}>) { 
    let authSelector = createFeatureSelector<any, AuthState>(authReducerKey);
    let authState = store.pipe(select(authSelector));
    authState.subscribe(state => { 
        this.autoLogin = state.autoLogin;
        this.includingPrivate = state.isPrivate;
        this.redirectUrl = state.redirectUrl;
    });
  }

  ngOnInit() {
    let includingPrivate = false;
    let autoLogin = false;
    if(this.route.snapshot.queryParamMap.has('private')){
      includingPrivate = this.route.snapshot.queryParamMap.get('private') == "true";
    }
    if(this.route.snapshot.queryParamMap.has('autoLogin')){
      autoLogin = this.route.snapshot.queryParamMap.get('autoLogin') == "true";
    }
    this.store.dispatch(navigateHere({autoLogin, isPrivate: includingPrivate}));
    this.oauthService.intialOAuthInfo().then((info) => {
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
  }
  
  changeScope(event: MatCheckboxChange){
    this.cookie.includingPrivate = event.checked;
    this.store.dispatch(scopeChanged({isPrivate: event.checked}));
  }

  login(){
    let scope = this.includingPrivate ? 'repo' : 'public_repo'
    let authroizeUrl = `${environment.authorizeOriginUrl}?client_id=${this.client_id}&state=${this.state}&scope=${scope}&redirect_uri=${this.redirectUrl}`;
    this.location.assign(authroizeUrl);
  }
}
