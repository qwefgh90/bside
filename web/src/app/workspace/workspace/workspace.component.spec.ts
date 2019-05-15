import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceComponent, FileType } from './workspace.component';
import { GithubTreeComponent } from '../tree/github-tree.component';
import { MatSidenavModule, MatDividerModule, MatButtonModule, MatIconModule, MatTreeModule, MatExpansionModule, MatSelectModule, MatMenu, MatIcon, MatMenuModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { WrapperService } from 'src/app/github/wrapper.service';
import { EditorComponent } from '../editor/editor.component';
import { ActionComponent } from '../action/action/action.component';
import { NgxMdModule } from 'ngx-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { TreeModule } from 'angular-tree-component';
import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { repositoryDetails, branches, tree } from 'src/app/testing/mock-data';
import { MonacoService } from '../editor/monaco.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GithubTreeNode } from '../tree/github-tree-node';

@Component({selector: 'app-editor', template: ''})
class EditorStubComponent {}
@Component({selector: 'app-tree', template: ''})
class GithubTreeStubComponent {
  
  @Input("repository") repository;
  @Input("tree") tree: any;
  @Output("nodeSelected") nodeSelected = new EventEmitter<any>();
  @Output("nodeCreated") nodeCreated = new EventEmitter<any>();

}

describe('WorkspaceComponent', () => {
  let component: WorkspaceComponent;
  let fixture: ComponentFixture<WorkspaceComponent>;
  let routerSpy;
  let routeStub;
  let wrapperServiceSpy;
  let repositoryDetailsSpy;
  let branchesSpy;
  let treeSpy;

  function mockWrapperServiceSpy(){
    repositoryDetailsSpy.and.returnValue(Promise.resolve(repositoryDetails));
    branchesSpy.and.returnValue(Promise.resolve(branches));
    treeSpy.and.returnValue(Promise.resolve(tree));
  }

  beforeEach(async(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routeStub = new ActivatedRouteStub({});
    routeStub.setParamMap({userId: 'id', repositoryName: 'repo'});
    routeStub.setQueryParamMap( {branch:'master'});    
    wrapperServiceSpy = jasmine.createSpyObj('WrapperService', ['repositoryDetails', 'branches', 'tree']);
    repositoryDetailsSpy = wrapperServiceSpy.repositoryDetails;
    branchesSpy = wrapperServiceSpy.branches;
    treeSpy = wrapperServiceSpy.tree;
    mockWrapperServiceSpy();
    TestBed.configureTestingModule({
      declarations: [WorkspaceComponent, GithubTreeStubComponent, EditorStubComponent, ActionComponent],
      providers: [{provide: ActivatedRoute, useValue: routeStub}, 
        {provide: WrapperService, useValue: wrapperServiceSpy}, 
        {provide: Router, useValue: routerSpy},
      {provide: MonacoService}],
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

  it('isImage()', () => {
    expect(component.isImage('a.png')).toBeTruthy();
    expect(component.isImage('a.jpg')).toBeTruthy();
    expect(component.isImage('a.jpeg')).toBeTruthy();
    expect(component.isImage('a.gif')).toBeTruthy();
    expect(component.isImage('a')).toBeFalsy();
  })

  it('getFileType()', () => {
    expect(component.getFileType('a.png', '')).toBe(FileType.Image);
    expect(component.getFileType('a.jpg', '')).toBe(FileType.Image);
    expect(component.getFileType('a.jpeg', '')).toBe(FileType.Image);
    expect(component.getFileType('a.gif', '')).toBe(FileType.Image);
    expect(component.getFileType('a', 'asdfasd')).toBe(FileType.Other);
    expect(component.getFileType('a', 'ㄱㄴㄷㄹ')).toBe(FileType.Other);
    expect(component.getFileType('a', 'YXNkZmFzZGY=')).toBe(FileType.Text);
    expect(component.getFileType('a', '7JWI64WV7ZWY7IS47JqpIQ==')).toBe(FileType.Text);
  })

  it('ngOnInit()', () => {
    fixture.detectChanges();
  })
});

export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private subject = new ReplaySubject<ParamMap>();
  private qsubject = new ReplaySubject<ParamMap>();

  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
  }

  /** The mock paramMap observable */
  readonly paramMap = this.subject.asObservable();
  /** The mock paramMap observable */
  readonly queryParamMap = this.qsubject.asObservable();

  snapshot = new ActivatedRouteSnapshotStub();

  /** Set the paramMap observables's next value */
  setParamMap(params?: Params) {
    this.subject.next(convertToParamMap(params));
    this.snapshot.paramMap = convertToParamMap(params);
    this.snapshot.params = params;
  };
  /** Set the paramMap observables's next value */
  setQueryParamMap(params?: Params) {
    this.qsubject.next(convertToParamMap(params));
    this.snapshot.queryParamMap = convertToParamMap(params);
    this.snapshot.queryParams = params;
  };
}
class ActivatedRouteSnapshotStub{
    constructor(){
        this.paramMap = convertToParamMap({});
        this.queryParamMap = convertToParamMap({});
    }
    params: Params;
    queryParams: Params;
    paramMap: ParamMap;
    queryParamMap: ParamMap;
}