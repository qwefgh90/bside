import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RedirectComponent } from './redirect.component';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from '../service/o-auth.service';
import { defer } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('RedirectComponent', () => {
  let component: RedirectComponent;
  let fixture: ComponentFixture<RedirectComponent>;
  let routeStub;
  let routerSpy;
  let oauthServiceSpy;
  beforeEach(async(() => {
    oauthServiceSpy = jasmine.createSpyObj('OAuthService', ['login'])
    oauthServiceSpy.login.and.returnValue(asyncData({accessToken: ''}).toPromise())
    routeStub = new ActivatedRouteStub();
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      declarations: [ RedirectComponent ],
      providers: [{provide: ActivatedRoute, useValue: routeStub},
        {provide: Router, useValue: routerSpy},
        {provide: OAuthService, useValue: oauthServiceSpy}],
      imports: [MatProgressSpinnerModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectComponent);
    component = fixture.componentInstance;
  });

  function asyncData<T>(data: T) {
    return defer(() => Promise.resolve(data));
  }

  it('redirect to /login if code and state are not provided', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    let navigate = (routerSpy.navigate as jasmine.Spy);
    const firstArg: Array<string> = navigate.calls.first().args[0];
    expect(firstArg[0]).toBe("/login");
  });

  it('doesn\' t redirect to /login if code and state are provided', () => {
    routeStub.setQueryParamMap({state: "", code: ""});
    fixture.detectChanges();
    expect(component).toBeTruthy();
    let navigate = (routerSpy.navigate as jasmine.Spy);
    expect(navigate.calls.count()).toBe(0);

    let login = (oauthServiceSpy.login as jasmine.Spy);
    expect(login.calls.count()).toBe(1);
  });

});
import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject } from 'rxjs';

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