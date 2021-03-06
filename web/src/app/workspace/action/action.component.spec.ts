import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionComponent } from './action.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WrapperService } from 'src/app/github/wrapper.service';

describe('ActionComponent', () => {
  let component: ActionComponent;
  let fixture: ComponentFixture<ActionComponent>;

  beforeEach(async(() => {
    let wrapperServiceSpy = jasmine.createSpyObj('WrapperService', ['user','getPageBranch']);
    wrapperServiceSpy.user.and.returnValue(new Promise((r) => {}));
    TestBed.configureTestingModule({
      declarations: [ ActionComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [MatExpansionModule, MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatButtonToggleModule,
        MatBadgeModule],
      providers: [{provide: WrapperService, useValue: wrapperServiceSpy}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
