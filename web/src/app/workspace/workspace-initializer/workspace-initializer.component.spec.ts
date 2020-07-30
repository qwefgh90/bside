import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceInitializerComponent } from './workspace-initializer.component';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

describe('WorkspaceInitializerComponent', () => {
  let component: WorkspaceInitializerComponent;
  let fixture: ComponentFixture<WorkspaceInitializerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceInitializerComponent ], 
      providers: [{provide: Store, useValue: {select: () => new Subject()}}]
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
