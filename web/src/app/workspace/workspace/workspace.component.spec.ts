import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceComponent } from './workspace.component';
import { TreeComponent } from '../tree/tree.component';
import { MatSidenavModule, MatDividerModule, MatButtonModule, MatIconModule, MatTreeModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from 'src/app/testing/activated-route-stub';
import { WrapperService } from 'src/app/github/wrapper.service';
import { EditorComponent } from '../editor/editor.component';

describe('WorkspaceComponent', () => {
  let component: WorkspaceComponent;
  let fixture: ComponentFixture<WorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkspaceComponent, TreeComponent, EditorComponent],
      imports: [MatSidenavModule,
        BrowserAnimationsModule,
        MatDividerModule,
        MatTreeModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule
      ],
      providers: [{provide: ActivatedRoute, userValue: new ActivatedRouteStub()}, {provide: WrapperService}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
