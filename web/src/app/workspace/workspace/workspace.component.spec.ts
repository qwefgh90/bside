import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { WorkspaceComponent, TreeStatusOnWorkspace } from './workspace.component';
import { MatSidenavModule, MatDividerModule, MatButtonModule, MatIconModule, MatTreeModule, MatExpansionModule, MatSelectModule, MatMenu, MatIcon, MatMenuModule, MatProgressSpinnerModule, MatButtonToggleModule, MatFormField, MatFormFieldModule, MatInputModule, MatBadgeModule, MatTabsModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { WrapperService } from 'src/app/github/wrapper.service';
import { ActionComponent } from '../action/action/action.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeModule } from 'angular-tree-component';
import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { repositoryDetails, branches, tree, blob1 } from 'src/app/testing/mock-data';
import { MonacoService } from '../editor/monaco.service';
import { Component, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { GithubTreeNode } from '../tree/github-tree-node';
import { FileType, TextUtil } from '../text/text-util';
import { LocalUploadService } from '../upload/local-upload.service';
import { UploadComponent } from '../upload/upload.component';
import { GithubTreeComponent } from '../tree/github-tree.component';
import { Editor } from '../editor/editor';
import { MarkdownModule } from 'ngx-markdown';
import { CommitProgressComponent } from './commit-progress/commit-progress.component';
import { TabComponent } from './tab/tab.component';
import { DatabaseToken } from 'src/app/db/database';
import { LocalDbService } from 'src/app/db/local-db.service';
import { WorkspaceService } from './workspace.service';

@Component({selector: 'app-stage', template: ''})
class StageComponent {
  @Input("repository") repository;
  @Input("tree") tree: GithubTreeNode;
  @Input("modifiedNodes") modifiedNodes: GithubTreeNode[];
  @Input("placeholder") placeholder;
}

@Component({selector: 'app-editor', template: ''})
class EditorStubComponent implements Editor{
  
  setContent(path: string, name: string){
    return ''
  }
  selectTab(path: string): boolean{
    return true;
  }
  exist(path: string): boolean{
    return true;
  }
  getContent(path?: string): string{
    return ''
  }
  removeContent(path: string): boolean{
    return true;
  } 
  shrinkExpand(){

  }

  diffWith(){

  }

  md(){

  }

  getPathList(): string[]{
    return [];
  }
  isMdOn: boolean

  get isDiffOn(){
    return false;
  }

  readonly: boolean;

  listOfContents = [];

  @Input("loadedPack") loadedPack;
}

@Component({
  selector: 'app-tree',
  template: '',
  providers: [
    {
      provide: GithubTreeComponent,
      useClass: GithubTreeStubComponent
    }]
})
class GithubTreeStubComponent {
  @Input("repository") repository;
  @Input("tree") tree: GithubTreeNode;
  @Output("nodeSelected") nodeSelected;
  @Output("nodeCreated") nodeCreated;
  @Output("nodeRemoved") nodeRemoved;
  @Output("nodeMoved") nodeMoved;
  @Output("nodeUploaded") nodeUploaded;
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
  let getBlobSpy;

  function mockWrapperServiceSpy(){
    repositoryDetailsSpy.and.returnValue(Promise.resolve(repositoryDetails));
    branchesSpy.and.returnValue(Promise.resolve(branches));
    treeSpy.and.returnValue(Promise.resolve(tree));
    getBlobSpy.and.returnValue(Promise.resolve(blob1));
  }

  beforeEach(async(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routeStub = new ActivatedRouteStub({});
    routeStub.setParamMap({userId: 'id', repositoryName: 'repo'});
    routeStub.setQueryParamMap( {branch:'master'});    
    wrapperServiceSpy = jasmine.createSpyObj('WrapperService', ['repositoryDetails', 'branches', 'tree', 'getBlob']);
    repositoryDetailsSpy = wrapperServiceSpy.repositoryDetails;
    branchesSpy = wrapperServiceSpy.branches;
    treeSpy = wrapperServiceSpy.tree;
    getBlobSpy = wrapperServiceSpy.getBlob;
    mockWrapperServiceSpy();
    TestBed.configureTestingModule({
      declarations: [WorkspaceComponent, GithubTreeComponent, UploadComponent, EditorStubComponent, ActionComponent, StageComponent, CommitProgressComponent, TabComponent],
      providers: [{provide: ActivatedRoute, useValue: routeStub}, 
        {provide: WrapperService, useValue: wrapperServiceSpy}, 
        {provide: Router, useValue: routerSpy},
      {provide: MonacoService}, {provide: LocalUploadService},
      {provide: DatabaseToken, useClass: LocalDbService}, WorkspaceService],
      imports: [MatSidenavModule,
        BrowserAnimationsModule,
        MatDividerModule,
        MatTreeModule,
        MatButtonModule,
        MatDividerModule,
        MatSelectModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,
        TreeModule.forRoot(),
        MatProgressSpinnerModule,
        MatButtonToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatBadgeModule,
        MarkdownModule.forRoot(),
        MatTabsModule
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('ngOnInit()', () => {
    fixture.detectChanges();
  })

  it('children', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);
    expect(component.tree).toBeDefined();
    expect(component.editor1).toBeDefined();
  }))


  // it('serialize()', fakeAsync(() => {
  //   fixture.detectChanges();
  //   tick(3000);
  //   fixture.detectChanges();
  //   tick(3000);
  //   let pack = component.serialize();
  //   expect(pack.commit_sha).toBe(component.selectedBranch.commit.sha);
  //   expect(pack.branchName).toBe('master')
  //   expect(pack.packs.length).toBe(0);
  //   expect(pack.tabs.length).toBe(0);
  // }))

  it('render GithubTreeComponent', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);
    expect(component.treeStatus).toBe(TreeStatusOnWorkspace.Done);

    const levelOneNodes = tree.tree.filter(e => {
      return !e.path.includes("/");
    });

    let treeNodes = fixture.nativeElement.querySelectorAll('tree-node');
    expect(treeNodes.length).toBe(levelOneNodes.length);
  }))

  it('nodeSelected()', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);
    
    let setContentSpy = spyOn(component.editor1, 'setContent');
    let selectTabSpy = spyOn(component.editor1, 'selectTab');
    let existSpy = spyOn(component.editor1, 'exist');
    existSpy.and.returnValue(false);

    let treeNodes = fixture.nativeElement.querySelectorAll('tree-node .node-title');
    treeNodes[0].click();
    fixture.detectChanges();
    tick(3000);

    expect(component.selectedNodePath).toBeDefined();
    expect(setContentSpy.calls.count()).toBe(1);
    expect(selectTabSpy.calls.first().args[0]).toBe(tree.tree[0].path);
    
    let pathArg = setContentSpy.calls.first().args[0];
    let contentArg = setContentSpy.calls.first().args[1];
    expect(tree.tree[0].path).toBe(pathArg);
    expect(TextUtil.base64ToString(blob1.content)).toBe(contentArg);
  }))

  it('nodeRemoved()', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);

    let existSpy = spyOn(component.editor1, 'exist');
    existSpy.and.returnValue(false);
    let removeContentSpy = spyOn(component.editor1, 'removeContent');
    
    component.selectedNodePath = component.tree.root.children[0].path;
    component.nodeRemoved(component.tree.root.children[0]);

    expect(removeContentSpy.calls.count()).toBe(1);
    expect(removeContentSpy.calls.first().args[0]).toBe(component.tree.root.children[0].path);
  }))

  it('nodeMoved()', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);

    let existSpy = spyOn(component.editor1, 'exist');
    let removeContentSpy = spyOn(component.editor1, 'removeContent');
    let setContentSpy = spyOn(component.editor1, 'setContent');
    let getContentSpy = spyOn(component.editor1, 'getContent');
    let selectTabSpy = spyOn(component.editor1, 'selectTab');
    let valueToReturn = 'this is value to return';
    getContentSpy.and.returnValue(valueToReturn)

    existSpy.and.returnValue(true);
    component.nodeMoved('test', component.tree.root.children[0]);

    expect(getContentSpy.calls.first().args[0]).toBe('test');
    expect(removeContentSpy.calls.first().args[0]).toBe('test');
    expect(setContentSpy.calls.first().args[0]).toBe(component.tree.root.children[0].path);
    expect(setContentSpy.calls.first().args[1]).toBe(valueToReturn);

    setContentSpy.calls.reset();
    existSpy.and.returnValue(false);
    component.nodeMoved('test', component.tree.root.children[0]);

    expect(setContentSpy.calls.count()).toBe(0);
  }))

  it('nodeUploaded()', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);

    let existSpy = spyOn(component.editor1, 'exist');
    let removeContentSpy = spyOn(component.editor1, 'removeContent');
    let setContentSpy = spyOn(component.editor1, 'setContent');

    existSpy.and.returnValue(true);
    let arg = {base64: 'aGVsbG8gd29ybGQh', node: component.tree.root.children[0]};
    component.nodeUploaded(arg);

    expect(setContentSpy.calls.first().args[0]).toBe(arg.node.path);
    expect(setContentSpy.calls.first().args[1]).toBe('hello world!');

    arg = {base64: 'aGVsbG8gd29ybGQh', node: component.tree.root.children[5].children[1].children[0]};
    component.nodeUploaded(arg);

    expect(setContentSpy.calls.all()[1].args[0]).toBe(arg.node.path);
    expect(setContentSpy.calls.all()[1].args[1]).toBe('aGVsbG8gd29ybGQh');
  }))

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