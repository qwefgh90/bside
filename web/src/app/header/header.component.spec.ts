
import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { Directive, Input, HostListener } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StoreModule } from '@ngrx/store';
import { initialState as appInitialState } from '../app.reducer';
import { authReducerKey, initialState as authInitialState } from '../oauth/auth.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import { mockUser, mockRouter, navigationStartWithRedirectUrl } from '../testing/header.component.mock';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthModule } from '../oauth/auth.module';
import { OAuthService } from '../oauth/service/o-auth.service';
import { Router, RouterModule, ActivatedRoute, ActivationEnd, NavigationStart } from '@angular/router';

describe('HeaderComponent with a user who signed in', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let oauthServiceSpy;
  let navigateSpy;
  let s = new Subject<NavigationStart>();
  beforeEach(async(() => {
    spyOnProperty(mockRouter, 'events').and.returnValue(s);
    navigateSpy = spyOn(mockRouter, 'navigate');
    oauthServiceSpy = jasmine.createSpyObj("OAuthService", ["logout"]);
    oauthServiceSpy.logout.and.returnValue(Promise.resolve());
    TestBed.configureTestingModule({
      declarations: [HeaderComponent, RouterLinkDirectiveStub],
      imports: [
        StoreModule.forRoot({
        }),
        AuthModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        FlexLayoutModule
      ], providers: [
        provideMockStore({initialState: {app: {...appInitialState, user: mockUser}, [authReducerKey]: {...authInitialState, isLogin: true, isPrivate: false}}}),
        {provide: OAuthService, useValue: oauthServiceSpy},
        {provide: Router, useValue: mockRouter}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('show a profile image' ,fakeAsync(() => {
    tick(1000);
    fixture.detectChanges();
    let headerEl: HTMLElement = fixture.nativeElement;
    let imgEl: HTMLImageElement = headerEl.querySelector('#profile-image');
    expect(imgEl).not.toBeNull();
  }));
  
  it('logout()', fakeAsync(() => {
    expect(component).toBeTruthy();
    component.logout();
    tick(1000);
    expect((oauthServiceSpy.logout as jasmine.Spy).calls.count()).toBe(1);
    tick(1000);
    expect((navigateSpy as jasmine.Spy).calls.count()).toBe(1);
  }));
});

describe('HeaderComponent with a user who signed out', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let oauthServiceSpy;
  let navigateSpy;
  let s = new Subject<NavigationStart>();
  beforeEach(async(() => {
    spyOnProperty(mockRouter, 'events').and.returnValue(s);
    navigateSpy = spyOn(mockRouter, 'navigate');
    oauthServiceSpy = jasmine.createSpyObj("OAuthService", ["logout"]);
    oauthServiceSpy.logout.and.returnValue(Promise.resolve());
    TestBed.configureTestingModule({
      declarations: [HeaderComponent, RouterLinkDirectiveStub],
      imports: [
        StoreModule.forRoot({
        }),
        AuthModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        FlexLayoutModule
      ], providers: [
        provideMockStore({initialState: {app: {...appInitialState, user: undefined}, [authReducerKey]: {...authInitialState, isLogin: false, isPrivate: false}}}),
        {provide: OAuthService, useValue: oauthServiceSpy},
        {provide: Router, useValue: mockRouter}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('show a sign in button' ,fakeAsync(() => {
    tick(1000);
    fixture.detectChanges();
    let headerEl: HTMLElement = fixture.nativeElement;
    let imgEl: HTMLImageElement = headerEl.querySelector('.signin');
    expect(imgEl).not.toBeNull();
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