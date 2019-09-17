import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OAuthService } from '../service/o-auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private oauthService: OAuthService, private router: Router
    ){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    console.log('LoginGuard#CanActivate called');
    let url: string = state.url;
    this.oauthService.checkSession();
    return this.checkLogin(url);
  }
  
  checkLogin(url: string): boolean {
    if (this.oauthService.isLogin) { return true; }

    // Store the attempted URL for redirecting
    this.oauthService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }
}