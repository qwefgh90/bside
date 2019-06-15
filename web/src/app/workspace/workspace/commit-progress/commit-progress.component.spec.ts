import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitProgressComponent } from './commit-progress.component';
import { MatProgressSpinnerModule } from '@angular/material';

describe('CommitProgressComponent', () => {
  let component: CommitProgressComponent;
  let fixture: ComponentFixture<CommitProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitProgressComponent ],
      imports: [MatProgressSpinnerModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
