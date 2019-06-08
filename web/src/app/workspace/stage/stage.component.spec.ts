import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageComponent } from './stage.component';
import { MatMenuModule, MatIconModule, MatButtonModule, MatDividerModule, MatInputModule } from '@angular/material';
import { TreeModule } from 'angular-tree-component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('StageComponent', () => {
  let component: StageComponent;
  let fixture: ComponentFixture<StageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StageComponent ],
      imports: [MatMenuModule, MatIconModule, MatDividerModule, MatInputModule,
        FormsModule,
        ReactiveFormsModule, BrowserAnimationsModule, 
        TreeModule.forRoot(), MatButtonModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
