import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { MatButtonModule, MatIconModule, MatToolbarModule, MatMenuModule } from '@angular/material';
import { AuthModule } from '../oauth/auth.module';
import { OAuthService } from '../oauth/service/o-auth.service';
import { Router } from '@angular/router';

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
      declarations: [HeaderComponent],
      imports: [
        AuthModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule
      ], providers: [{provide: OAuthService, useValue: oauthServiceSpy},
        {provide: Router, useValue: routerSpy}]
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
