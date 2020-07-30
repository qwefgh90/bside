import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { OAuthService } from './o-auth.service';
import { CookieToken } from 'src/app/db/cookie';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

describe('OAuthService', () => {
  let storeSpy;
  let dispatchSpy: jasmine.Spy;
  let cookie = {autoLogin: false, includingPrivate: false};
  beforeEach(() => {
    storeSpy = jasmine.createSpyObj("Store", ['dispatch', 'pipe']);
    (storeSpy.pipe as jasmine.Spy).and.returnValue(new Subject());
    dispatchSpy = (storeSpy.dispatch as jasmine.Spy);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: CookieToken, useValue: cookie },
      { provide: Store, useValue: storeSpy },
      ]
    })
});

  it('tests intialOAuthInfo()', (done: DoneFn) => {
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

  it('tests getAccessToken()', (done: DoneFn) => {
    const service: OAuthService = TestBed.get(OAuthService);
    expect(service).toBeTruthy();
    service.getAccessToken("state", "code").then(() => {
      expect(dispatchSpy.calls.count()).toBe(1);
      done();
    });

    const httpTestingController = TestBed.get(HttpTestingController);
    const req = httpTestingController.expectOne('/api/login/github/accesstoken');
    expect(req.request.method).toEqual('POST');
    req.flush({});
    httpTestingController.verify();
  });

  it('tests logout()', (done: DoneFn) => {
    const service: OAuthService = TestBed.get(OAuthService);
    expect(service).toBeTruthy();
    service.logout().then(() => {
      expect(dispatchSpy.calls.count()).toBe(1);
      done();
    });

    const httpTestingController = TestBed.get(HttpTestingController);
    const req = httpTestingController.expectOne('/api/login/github/logout');
    expect(req.request.method).toEqual('POST');
    req.flush({});
    httpTestingController.verify();
  });

  it('tests initAccessTokenOnSession()', (done: DoneFn) => {
    const service: OAuthService = TestBed.get(OAuthService);
    expect(service).toBeTruthy();
    service.initAccessTokenOnSession().then(() => {
      expect(dispatchSpy.calls.count()).toBe(1);
      done();
    });

    const httpTestingController = TestBed.get(HttpTestingController);
    const req = httpTestingController.expectOne('/api/login/github/accesstoken');
    expect(req.request.method).toEqual('GET');
    req.flush({});
    httpTestingController.verify();
  });

  it('tests checkConnectionWithBackend()', (done: DoneFn) => {
    const service: OAuthService = TestBed.get(OAuthService);
    expect(service).toBeTruthy();
    service.checkConnectionWithBackend().then((v) => {
      expect(v).toBeTruthy();
      done();
    });

    const httpTestingController = TestBed.get(HttpTestingController);
    const req = httpTestingController.expectOne('/api/login/github/ping');
    expect(req.request.method).toEqual('GET');
    req.flush({});
    httpTestingController.verify();
  });

  it('tests checkConnectionWithBackend() with 500 error', (done: DoneFn) => {
    const service: OAuthService = TestBed.get(OAuthService);
    expect(service).toBeTruthy();
    service.checkConnectionWithBackend().then((v) => {
      expect(dispatchSpy.calls.count()).toBe(1);
      expect(v).toBeFalsy();
      done();
    });

    const httpTestingController = TestBed.inject(HttpTestingController);
    const req = httpTestingController.expectOne('/api/login/github/ping');
    expect(req.request.method).toEqual('GET');
    req.flush({}, {status: 500, statusText: "An error occurs in the server"});
    httpTestingController.verify();
  });
});
