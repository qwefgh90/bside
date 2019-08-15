import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeComponent } from './welcome.component';
import { OAuthService } from '../oauth/service/o-auth.service';
import { FlexLayoutModule } from '@angular/flex-layout';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  beforeEach(async(() => {
    
    TestBed.configureTestingModule({
      declarations: [ WelcomeComponent ],
      providers: [{provide: OAuthService, useValue: {isLogin: false}}],
      imports: [FlexLayoutModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
