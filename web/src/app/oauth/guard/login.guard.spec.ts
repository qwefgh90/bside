import { TestBed, async, inject } from '@angular/core/testing';

import { LoginGuard } from './login.guard';
import { OAuthService } from '../service/o-auth.service';
import { Router } from '@angular/router';
import { CookieToken } from 'src/app/db/cookie';

describe('LoginGuard', () => {
  let routerSpy;
  let oauthServiceDummy;
  let cookie = {autoLogin: false, includingPrivate: false};
  beforeEach(() => {
    oauthServiceDummy = {isLogin: false, redirectUrl: ''}; // it is copied on oauthService
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [LoginGuard, {provide: OAuthService, useValue: oauthServiceDummy},
        {provide: Router, useValue: routerSpy},
        {provide: CookieToken, useValue: cookie}] 
    });
  });

  it('should ...', inject([LoginGuard], (guard: LoginGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('checkLogin()', inject([LoginGuard], (guard: LoginGuard) => {
    expect(guard).toBeTruthy();
    guard.checkLogin('redirectUrl');
    let calls = (routerSpy.navigate as jasmine.Spy).calls;
    let first = calls.first();
    expect(first.args[0][0]).toBe('/login');
    expect(calls.count()).toBe(1);
  }));
});
