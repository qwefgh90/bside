import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffEditorComponent } from './diff-editor.component';
import { MatSidenavModule, MatProgressSpinnerModule } from '@angular/material';

describe('DiffEditorComponent', () => {
  let component: DiffEditorComponent;
  let fixture: ComponentFixture<DiffEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiffEditorComponent ],
      imports: [MatSidenavModule,
        MatProgressSpinnerModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
