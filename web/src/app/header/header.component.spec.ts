import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { MatButtonModule, MatIconModule, MatToolbarModule, MatMenuModule, MatProgressSpinnerModule } from '@angular/material';
import { AuthModule } from '../oauth/auth.module';
import { OAuthService } from '../oauth/service/o-auth.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let oauthServiceSpy;
  let routerSpy;
  beforeEach(async(() => {
    oauthServiceSpy = jasmine.createSpyObj("OAuthService", ["logout"]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    oauthServiceSpy.logout.and.returnValue(Promise.resolve());
    TestBed.configureTestingModule({
      declarations: [HeaderComponent, RouterLinkDirectiveStub],
      imports: [
        AuthModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        FlexLayoutModule
      ], providers: [{provide: OAuthService, useValue: oauthServiceSpy},
        {provide: Router, useValue: routerSpy},
        {provide: ActivatedRoute, useValue: new ActivatedRouteStub}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('logout()', fakeAsync(() => {
    expect(component).toBeTruthy();
    component.logout();
    tick(1000);
    expect((oauthServiceSpy.logout as jasmine.Spy).calls.count()).toBe(1);
    tick(1000);
    expect((routerSpy.navigate as jasmine.Spy).calls.count()).toBe(1);
  }));

});

import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { Directive, Input, HostListener } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

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
@Directive({
  selector: '[routerLink]'
})
class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click')
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}