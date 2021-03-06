import { async, ComponentFixture, TestBed, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';

import { LoginComponent, LOCATION_TOKEN, LoginStatus } from './login.component';
import { OAuthService } from '../service/o-auth.service';
import { defer, ReplaySubject, Subject } from 'rxjs'
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Params, convertToParamMap } from '@angular/router';
import { CookieToken } from 'src/app/db/cookie';
import { Store } from '@ngrx/store';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let oauthServiceSpy;
  let locationSpy;
  let routeStub;
  let storeSpy;
  let cookie = {autoLogin: false, includingPrivate: false};
  beforeEach(async(() => {
    storeSpy = jasmine.createSpyObj("Store", ['dispatch', 'pipe']);
    (storeSpy.pipe as jasmine.Spy).and.returnValue(new Subject());
    oauthServiceSpy = jasmine.createSpyObj('OAuthService', ['intialOAuthInfo'])
    oauthServiceSpy.intialOAuthInfo.and.returnValue(asyncData({state: 'state', client_id: 'client_id'}).toPromise())
    locationSpy = jasmine.createSpyObj('Location', ['assign'])
    routeStub = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        {provide: ActivatedRoute, useValue: routeStub},
        {provide: OAuthService, useValue: oauthServiceSpy},
        {provide: LOCATION_TOKEN, useValue: locationSpy},
        {provide: Store, useValue: storeSpy},
        {provide: CookieToken, useValue: cookie}],
      imports: [
          BrowserAnimationsModule,
          MatCardModule,
          MatButtonModule,
          MatProgressSpinnerModule,
          MatIconModule,
          MatCheckboxModule,
          MatSlideToggleModule,
          FormsModule,
          ReactiveFormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  function asyncData<T>(data: T) {
    return defer(() => Promise.resolve(data));
  }

  it('navigate the authorize page of github', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
    component.login();
    let assignSpy = locationSpy.assign as jasmine.Spy;
    expect(assignSpy.calls.count()).toBe(1);
    let githubLocation: string = assignSpy.calls.first().args[0];
    expect(githubLocation).toContain("state=state");
    expect(githubLocation).toContain("client_id=client_id");
    expect(githubLocation).toContain("scope=public_repo");
    expect(githubLocation).toContain(component.redirectUrl);
    expect(component.status).toBe(LoginStatus.Initialized)
    console.debug('github location: ' + githubLocation);
  }));
});

export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private subject = new ReplaySubject<ParamMap>();
  private qsubject = new ReplaySubject<ParamMap>();

  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
  }

  /** The mock paramMap observable */
  readonly paramMap = this.subject.asObservable();
  /** The mock paramMap observable */
  readonly queryParamMap = this.qsubject.asObservable();

  snapshot = new ActivatedRouteSnapshotStub();

  /** Set the paramMap observables's next value */
  setParamMap(params?: Params) {
    this.subject.next(convertToParamMap(params));
    this.snapshot.paramMap = convertToParamMap(params);
  };
  /** Set the paramMap observables's next value */
  setQueryParamMap(params?: Params) {
    this.qsubject.next(convertToParamMap(params));
    this.snapshot.queryParamMap = convertToParamMap(params);
  };
}
class ActivatedRouteSnapshotStub{
    constructor(){
        this.paramMap = convertToParamMap({});
        this.queryParamMap = convertToParamMap({});
    }
    paramMap: ParamMap;
    queryParamMap: ParamMap;
}