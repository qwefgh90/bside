import { TestBed, async, inject } from '@angular/core/testing';

import { LoginGuard } from './login.guard';
import { OAuthService } from '../service/o-auth.service';
import { Router } from '@angular/router';
import { CookieToken } from 'src/app/db/cookie';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

describe('LoginGuard', () => {
  let routerSpy;
  let oauthServiceDummy;
  let storeSpy;
  let dispatchSpy: jasmine.Spy;
  let navigateSpy: jasmine.Spy;
  let cookie = {autoLogin: false, includingPrivate: false};
  beforeEach(() => {
    storeSpy = jasmine.createSpyObj("Store", ['dispatch', 'pipe']);
    (storeSpy.pipe as jasmine.Spy).and.returnValue(new Subject());
    dispatchSpy = (storeSpy.dispatch as jasmine.Spy);
    oauthServiceDummy = {isLogin: false, redirectUrl: ''}; // it is copied on oauthService
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    navigateSpy = (routerSpy.navigate as jasmine.Spy);
    TestBed.configureTestingModule({
      providers: [LoginGuard, {provide: OAuthService, useValue: oauthServiceDummy},
        {provide: Router, useValue: routerSpy},
        {provide: CookieToken, useValue: cookie},
        {provide: Store, useValue: storeSpy},
      ] 
    });
  });

  it('should ...', inject([LoginGuard], (guard: LoginGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('goLogin() with falsy params', inject([LoginGuard], (guard: LoginGuard) => {
    expect(guard).toBeTruthy();
    guard.goLogin("");
    expect(navigateSpy.calls.count()).toBe(1);
    expect(dispatchSpy.calls.count()).toBe(1);
    let q = navigateSpy.calls.first().args[1].queryParams;
    expect(q.autoLogin).toBeUndefined();
    expect(q.private).toBeUndefined();
  }));

  it('goLogin() with truthy params', inject([LoginGuard], (guard: LoginGuard) => {
    cookie.autoLogin = true;
    cookie.includingPrivate = true;
    expect(guard).toBeTruthy();
    guard.goLogin("");
    expect(navigateSpy.calls.count()).toBe(1);
    expect(dispatchSpy.calls.count()).toBe(1);
    let q = navigateSpy.calls.first().args[1].queryParams;
    expect(q.autoLogin).toBeTruthy();
    expect(q.private).toBeTruthy();
  }));
});
