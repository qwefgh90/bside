import { Injectable, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { OAuthService } from '../service/o-auth.service';
import { CookieToken, Cookie } from 'src/app/db/cookie';
import { Store, select, createFeatureSelector, createSelector } from '@ngrx/store';
import { keepRedirectionUrl } from '../auth.actions';
import { environment } from 'src/environments/environment';
import { TextUtil } from 'src/app/workspace/text/text-util';
import { authReducerKey, AuthState } from '../auth.reducer';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private oauthService: OAuthService, private router: Router, @Inject(CookieToken) private cookie: Cookie, private store: Store<{}>
    ){
      let selector = createFeatureSelector<any, AuthState>(authReducerKey);
      let isLoginSelector = createSelector(selector, (state: AuthState) => state.isLogin);
      let isLogin$ = this.store.pipe(select(isLoginSelector));
      isLogin$.subscribe((isLogin: boolean) => {
        this.isLogin = isLogin;
      });
  }

  isLogin = false;
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    console.log('LoginGuard#CanActivate called');
    let url: string = state.url;
    let success = this.oauthService.checkConnectionWithAPIServer().then((success) => { // if session is invalid, execute checkLogin()
      if(!success){
        this.checkLogin(url);
        return false;
      }else
        return true;
    });
    return from(success);
    // return this.checkLogin(url);  // It doesn't wait for checkSession()
  }
  
  redirectURL(routeUrl: string) {
    return `${environment.redirect_url}?route=${routeUrl ? TextUtil.stringToBase64(routeUrl) : ''}`;
  }

  checkLogin(url: string) {
    // if (this.isLogin) { return true; }

    // Store the attempted URL for redirecting
    this.store.dispatch(keepRedirectionUrl({redirectUrl: this.redirectURL(url)}));
    let params = new Object();
    if(this.cookie.autoLogin){
      params['autoLogin'] = true;
    }
    if(this.cookie.includingPrivate){
      params['private'] = true;
    }
    // Navigate to the login page with extras
    this.router.navigate(['/login'], {queryParams : params});
    // return false;
  }
}