import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MatButtonModule, MatIconModule, MatToolbarModule, MatMenuModule, MatProgressSpinnerModule, MatSpinner, MatDividerModule } from '@angular/material';
import { AuthModule } from './oauth/auth.module';
import { FlexLayoutModule } from '@angular/flex-layout';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
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
        AppComponent, HeaderComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  // it(`should have as title 'web'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('web');
  // });

});
