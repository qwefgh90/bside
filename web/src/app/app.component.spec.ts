import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthModule } from './oauth/auth.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Router, ActivationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { activationEndEventWhenGoingToWorkspace, activationEndEventWhenBeingOutOfWorkspace, } from './testing/app.component.mock';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DeviceDetectorService } from 'ngx-device-detector';
import { StoreModule } from '@ngrx/store';
import { authReducerKey, authReducer, initialState } from './oauth/auth.reducer';
import { Component } from '@angular/core';

@Component({selector: 'app-header', template: ''})
class HeaderStubComponent {}

describe('AppComponent', () => {
  const mockRouter = {get events(){return undefined}};
  beforeEach(async(() => {
    let s = new Subject<ActivationEnd>();
    spyOnProperty(mockRouter, 'events').and.returnValue(s);
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          [authReducerKey]: authReducer
        }),
        AuthModule,
        RouterTestingModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        FlexLayoutModule
      ],
      declarations: [
        AppComponent, HeaderStubComponent
      ],
      providers: [
        provideMockStore({initialState: {[authReducerKey]: initialState}}),
        {provide: Router, useValue: mockRouter},
        {provide: DeviceDetectorService, useValue: {isDesktop: () => true}}]
    }).compileComponents();
    let store = TestBed.inject(MockStore);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should know that it is in the workspace', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    mockRouter.events.next(activationEndEventWhenGoingToWorkspace);
    tick(1000);
    expect(fixture.componentInstance.inWorkspace).toBe(true);
  }));

  it('should know that it is in the workspace', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    mockRouter.events.next(activationEndEventWhenBeingOutOfWorkspace);
    tick(1000);
    expect(fixture.componentInstance.inWorkspace).toBe(false);
  }));
});
