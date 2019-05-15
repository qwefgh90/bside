import { async, ComponentFixture, TestBed, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';

import { LoginComponent, LOCATION_TOKEN, LoginStatus } from './login.component';
import { OAuthService } from '../service/o-auth.service';
import { defer } from 'rxjs'
import { MatButtonModule, MatCardModule, MatProgressSpinnerModule, MatIconModule, MatCheckboxModule, MatSlideToggleModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let oauthServiceSpy;
  let locationSpy;
  beforeEach(async(() => {
    oauthServiceSpy = jasmine.createSpyObj('OAuthService', ['intialOAuthInfo'])
    oauthServiceSpy.intialOAuthInfo.and.returnValue(asyncData({state: 'state', client_id: 'client_id'}).toPromise())
    locationSpy = jasmine.createSpyObj('Location', ['assign'])
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        {provide: OAuthService, useValue: oauthServiceSpy},
        {provide: LOCATION_TOKEN, useValue: locationSpy}],
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
    let spy = locationSpy.assign as jasmine.Spy;
    expect(spy.calls.count()).toBe(1);
    let githubLocation: string = spy.calls.first().args[0];
    expect(githubLocation).toContain("state=state")
    expect(githubLocation).toContain("client_id=client_id")
    expect(githubLocation).toContain(component.makeRedirectUrl());
    expect(component.status).toBe(LoginStatus.Initialized)
    console.debug('github location: ' + githubLocation);
  }));
});
