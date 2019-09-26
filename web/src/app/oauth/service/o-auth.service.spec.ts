import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { OAuthService } from './o-auth.service';
import { CookieToken } from 'src/app/db/cookie';

describe('OAuthService', () => {
  let cookie = {autoLogin: false, includingPrivate: false};
  beforeEach(() => TestBed.configureTestingModule({
    imports:[HttpClientTestingModule],
    providers: [{provide: CookieToken, useValue: cookie}]
  }));

  it('intialOAuthInfo()', (done: DoneFn) => {
    const service: OAuthService = TestBed.get(OAuthService);
    expect(service).toBeTruthy();
    service.intialOAuthInfo().then(v => {
      expect(v.client_id).toBeDefined();
      expect(v.state).toBeDefined();
      done();
    });

    const httpTestingController = TestBed.get(HttpTestingController);
    const req = httpTestingController.expectOne('/api/login/github/initialdata');
    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    req.flush({state: '', client_id: ''});

    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  });
  
  it('login()', (done: DoneFn) => {
    const service: OAuthService = TestBed.get(OAuthService);
    expect(service.accessToken).toBeUndefined;
    expect(service.isLogin).toBeFalsy();
    expect(service).toBeTruthy();
    
    service.login('','').then(v => {
      expect(service.accessToken).toBeDefined();
      expect(service.isLogin).toBeTruthy();
      done();
    });

    const httpTestingController = TestBed.get(HttpTestingController);
    const req = httpTestingController.expectOne('/api/login/github/accesstoken');
    // Assert that the request is a GET.
    expect(req.request.method).toEqual('POST');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    req.flush({access_token: ''});

    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  });

  it('logout()', (done: DoneFn) => {
    const service: OAuthService = TestBed.get(OAuthService);
    service.accessToken = "fake";
    service.isLogin = true;
    expect(service).toBeTruthy();
    
    service.logout().then(v => {
      expect(service.accessToken).toBeUndefined;
      expect(service.isLogin).toBeFalsy();
      done();
    });

    const httpTestingController = TestBed.get(HttpTestingController);
    const req = httpTestingController.expectOne('/api/login/github/logout');
    // Assert that the request is a GET.
    expect(req.request.method).toEqual('POST');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    req.flush({});

    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  });

  it('initAccessTokenOnSession()', (done: DoneFn) => {
    const service: OAuthService = TestBed.get(OAuthService);
    expect(service.accessToken).toBeUndefined;
    expect(service.isLogin).toBeFalsy();
    expect(service).toBeTruthy();
    
    service.initAccessTokenOnSession().then(v => {
      expect(service.accessToken).toBeDefined();
      expect(service.isLogin).toBeTruthy();
      done();
    });

    const httpTestingController = TestBed.get(HttpTestingController);
    const req = httpTestingController.expectOne('/api/login/github/accesstoken');
    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    req.flush({access_token: ''});

    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  });
});
