import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildHistoryComponent } from './build-history.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { WrapperService } from 'src/app/github/wrapper.service';

describe('BuildHistoryComponent', () => {
  let component: BuildHistoryComponent;
  let fixture: ComponentFixture<BuildHistoryComponent>;

  beforeEach(async(() => {
    let matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    let wrapperServiceSpy = jasmine.createSpyObj('WrapperService', ['repositoryDetails', 'branches', 'tree', 'getBlob', 'getPageBranch', 'buildStatus']);
    wrapperServiceSpy.getPageBranch.and.returnValue(new Promise((r) => {}));
    wrapperServiceSpy.buildStatus.and.returnValue(new Promise((r) => {}));
    TestBed.configureTestingModule({
      declarations: [ BuildHistoryComponent ],
      providers: [{provide: MatDialogRef, useValue: matDialogRefSpy}, {provide: MAT_DIALOG_DATA, useValue: {}}, {provide: WrapperService, useValue: wrapperServiceSpy}],
      imports: [MatDialogModule, MatTableModule, MatProgressSpinnerModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
