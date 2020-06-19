import { Injectable, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OAuthService } from '../service/o-auth.service';
import { CookieToken, Cookie } from 'src/app/db/cookie';
import { Store } from '@ngrx/store';
import { redirectUrlChanged } from '../auth.actions';
import { environment } from 'src/environments/environment';
import { TextUtil } from 'src/app/workspace/text/text-util';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private oauthService: OAuthService, private router: Router, @Inject(CookieToken) private cookie: Cookie, private store: Store<{}>
    ){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    console.log('LoginGuard#CanActivate called');
    let url: string = state.url;
    this.oauthService.checkSession().then(() => { // if session is invalid, execute checkLogin()
      this.checkLogin(url);
    });
    return this.checkLogin(url);  // It doesn't wait for checkSession()
  }
  

  redirectURL(routeUrl: string) {
    return `${environment.redirect_url}?route=${routeUrl ? TextUtil.stringToBase64(routeUrl) : ''}`;
  }

  checkLogin(url: string): boolean {
    if (this.oauthService.isLogin) { return true; }

    // Store the attempted URL for redirecting
    // this.oauthService.redirectUrl = url;
    this.store.dispatch(redirectUrlChanged({redirectUrl: this.redirectURL(url)}));
    let params = new Object();
    if(this.cookie.autoLogin){
      params['autoLogin'] = true;
    }
    if(this.cookie.includingPrivate){
      params['private'] = true;
    }
    // Navigate to the login page with extras
    this.router.navigate(['/login'], {queryParams : params});
    return false;
  }
}