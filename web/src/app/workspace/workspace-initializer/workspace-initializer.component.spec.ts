import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceInitializerComponent } from './workspace-initializer.component';

describe('WorkspaceInitializerComponent', () => {
  let component: WorkspaceInitializerComponent;
  let fixture: ComponentFixture<WorkspaceInitializerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceInitializerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceInitializerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
