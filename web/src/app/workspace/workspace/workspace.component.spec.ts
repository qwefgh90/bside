import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceComponent } from './workspace.component';
import { GithubTreeComponent } from '../tree/github-tree.component';
import { MatSidenavModule, MatDividerModule, MatButtonModule, MatIconModule, MatTreeModule, MatExpansionModule, MatSelectModule, MatMenu, MatIcon, MatMenuModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteStub } from 'src/app/testing/activated-route-stub';
import { WrapperService } from 'src/app/github/wrapper.service';
import { EditorComponent } from '../editor/editor.component';
import { ActionComponent } from '../action/action/action.component';
import { NgxMdModule } from 'ngx-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { TreeModule } from 'angular-tree-component';

describe('WorkspaceComponent', () => {
  let component: WorkspaceComponent;
  let fixture: ComponentFixture<WorkspaceComponent>;
  let routerSpy;
  beforeEach(async(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      declarations: [WorkspaceComponent, GithubTreeComponent, EditorComponent, ActionComponent],
      imports: [MatSidenavModule,
        BrowserAnimationsModule,
        MatDividerModule,
        MatTreeModule,
        MatButtonModule,
        MatDividerModule,
        NgxMdModule.forRoot(),
        MatSelectModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,
        TreeModule.forRoot(),
      ],
      providers: [{provide: ActivatedRoute, userValue: new ActivatedRouteStub()}, {provide: WrapperService}, {provide: Router, userValue: routerSpy}],
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
