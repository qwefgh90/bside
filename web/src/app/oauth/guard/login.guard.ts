import { Injectable, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OAuthService } from '../service/o-auth.service';
import { CookieToken, Cookie } from 'src/app/db/cookie';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private oauthService: OAuthService, private router: Router, @Inject(CookieToken) private cookie: Cookie
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
  
  checkLogin(url: string): boolean {
    if (this.oauthService.isLogin) { return true; }

    // Store the attempted URL for redirecting
    this.oauthService.redirectUrl = url;
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