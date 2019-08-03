import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForkComponent } from './fork.component';
import { MatStepperModule, MatSelectModule, MatFormFieldModule, MatProgressSpinnerModule, MatDialogRef, MAT_DIALOG_DATA, MatFormFieldControl, MatInputModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { WrapperService } from 'src/app/github/wrapper.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ForkComponent', () => {
  let component: ForkComponent;
  let fixture: ComponentFixture<ForkComponent>;

  beforeEach(async(() => {
    let matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    let wrapperServiceSpy = jasmine.createSpyObj('WrapperService', ['user','getPageBranch']);
    wrapperServiceSpy.user.and.returnValue(new Promise((r) => {}));
    wrapperServiceSpy.getPageBranch.and.returnValue(new Promise((r) => {}));
    TestBed.configureTestingModule({
      declarations: [ ForkComponent ],
      providers: [{provide: MatDialogRef, useValue: matDialogRefSpy}, FormBuilder, {provide:WrapperService, useValue:wrapperServiceSpy}, {provide: MAT_DIALOG_DATA, useValue: {repoName: 'asdf'}}],
      imports: [MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatProgressButtonsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
