import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeComponent } from './welcome.component';
import { OAuthService } from '../oauth/service/o-auth.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { TemplatesModule } from '../templates/templates.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Input, Component } from '@angular/core';

@Component({selector: 'app-list', template: ''})
class ListComponent {
  @Input("singleMode") singleMode: boolean;
}

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeComponent, ListComponent],
      providers: [{provide: OAuthService, useValue: {isLogin: false}}],
      imports: [FlexLayoutModule, MatIconModule]
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
