import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RedirectComponent } from './redirect.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteStub } from 'src/app/testing/activated-route-stub';
import { OAuthService } from '../service/o-auth.service';
import { defer } from 'rxjs';

describe('RedirectComponent', () => {
  let component: RedirectComponent;
  let fixture: ComponentFixture<RedirectComponent>;
  let routeStub;
  let routerSpy;
  let oauthServiceSpy;
  beforeEach(async(() => {
    oauthServiceSpy = jasmine.createSpyObj('OAuthService', ['makeAccessToken'])
    oauthServiceSpy.makeAccessToken.and.returnValue(asyncData({accessToken: ''}).toPromise())
    routeStub = new ActivatedRouteStub();
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      declarations: [ RedirectComponent ],
      providers: [{provide: ActivatedRoute, useValue: routeStub},
        {provide: Router, useValue: routerSpy},
        {provide: OAuthService, useValue: oauthServiceSpy}]
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

    let makeAccessToken = (oauthServiceSpy.makeAccessToken as jasmine.Spy);
    expect(makeAccessToken.calls.count()).toBe(1);
  });

});
