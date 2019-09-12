import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { WorkspaceComponent, TreeStatusOnWorkspace } from './workspace.component';
import { MatSidenavModule, MatDividerModule, MatButtonModule, MatIconModule, MatTreeModule, MatExpansionModule, MatSelectModule, MatMenu, MatIcon, MatMenuModule, MatProgressSpinnerModule, MatButtonToggleModule, MatFormField, MatFormFieldModule, MatInputModule, MatBadgeModule, MatTabsModule, MatDialog } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { WrapperService } from 'src/app/github/wrapper.service';
import { ActionComponent } from '../action/action.component';
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
import { CommitProgressComponent } from './commit-progress/commit-progress.component';
import { TabComponent } from '../tab/tab.component';
import { DatabaseToken } from 'src/app/db/database';
import { LocalDbService } from 'src/app/db/local-db.service';
import { WorkspaceService } from '../workspace.service';
import { DeviceDetectorModule, DeviceDetectorService } from 'ngx-device-detector';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({selector: 'app-stage', template: ''})
class StageComponent {
  @Input("repository") repository;
  @Input("tree") tree: GithubTreeNode;
  @Input("modifiedNodes") modifiedNodes: GithubTreeNode[];
  @Input("placeholder") placeholder;
  @Input("branch") branch;
}

@Component({selector: 'app-markdown-editor', template: ''})
class MarkdownStubEditorComponent implements Editor{
  clear(){}
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
  shrinkExpand(){}
  diffWith(){}
  md(){}

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

  load(){

  }
}
@Component({selector: 'app-editor', template: ''})
class EditorStubComponent implements Editor{
  clear(){}
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
  shrinkExpand(){}
  diffWith(){}
  md(){}

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

  load(){

  }
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
  let getPageBranchSpy;
  let workspaceService: WorkspaceService;
  let matDialogSpy;

  function mockWrapperServiceSpy(){
    repositoryDetailsSpy.and.returnValue(Promise.resolve(repositoryDetails));
    branchesSpy.and.returnValue(Promise.resolve(branches));
    treeSpy.and.returnValue(Promise.resolve(tree));
    getBlobSpy.and.returnValue(Promise.resolve(blob1));
    getPageBranchSpy.and.returnValue(Promise.resolve());
  }

  beforeEach(async(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routeStub = new ActivatedRouteStub({});
    routeStub.setParamMap({userId: 'id', repositoryName: 'repo'});
    routeStub.setQueryParamMap( {branch:'master'});    
    wrapperServiceSpy = jasmine.createSpyObj('WrapperService', ['repositoryDetails', 'branches', 'tree', 'getBlob', 'getPageBranch']);
    repositoryDetailsSpy = wrapperServiceSpy.repositoryDetails;
    branchesSpy = wrapperServiceSpy.branches;
    treeSpy = wrapperServiceSpy.tree;
    getBlobSpy = wrapperServiceSpy.getBlob;
    getPageBranchSpy = wrapperServiceSpy.getPageBranch;
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);
    mockWrapperServiceSpy();
    TestBed.configureTestingModule({
      declarations: [MarkdownStubEditorComponent, WorkspaceComponent, GithubTreeComponent, UploadComponent, EditorStubComponent, ActionComponent, StageComponent, CommitProgressComponent, TabComponent],
      providers: [{provide: ActivatedRoute, useValue: routeStub}, 
        {provide: WrapperService, useValue: wrapperServiceSpy}, 
        {provide: Router, useValue: routerSpy},
        {provide: MatDialog, useValue: matDialogSpy},
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
        MatTabsModule,
        DeviceDetectorModule.forRoot(),
        FlexLayoutModule
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceComponent);
    workspaceService = TestBed.get(WorkspaceService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('ngOnInit()', () => {
    fixture.detectChanges();
  })

  it('define child components', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);
    expect(component.tree).toBeDefined();
    expect(component.editor).toBeDefined();
  }))

  it('render nodes in GithubTreeComponent', fakeAsync(() => {
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
    
    let setContentSpy = spyOn(component.editor, 'setContent');
    let selectTabSpy = spyOn(component.editor, 'selectTab');
    let existSpy = spyOn(component.editor, 'exist');
    existSpy.and.returnValue(false);

    let treeNodes = fixture.nativeElement.querySelectorAll('tree-node .node-title');
    treeNodes[0].click();
    fixture.detectChanges();
    tick(10000);

    expect(component.selectedNodePath).toBeDefined();
    expect(selectTabSpy.calls.first().args[0]).toBe(tree.tree[0].path);
    
    expect(setContentSpy.calls.count()).toBe(1);
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

    let existSpy = spyOn(component.editor, 'exist');
    existSpy.and.returnValue(false);
    let removeContentSpy = spyOn(component.editor, 'removeContent');
    
    component.selectedNodePath = component.tree.root.children[0].path;
    component.nodeRemoved(component.tree.root.children[0].path);

    expect(removeContentSpy.calls.count()).toBe(1);
    expect(removeContentSpy.calls.first().args[0]).toBe(component.tree.root.children[0].path);
  }))

  it('nodeMoved()', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);

    let existSpy = spyOn(component.editor, 'exist');
    let removeContentSpy = spyOn(component.editor, 'removeContent');
    let setContentSpy = spyOn(component.editor, 'setContent');
    let getContentSpy = spyOn(component.editor, 'getContent');
    let selectTabSpy = spyOn(component.editor, 'selectTab');
    let valueToReturn = 'this is the value to return';
    getContentSpy.and.returnValue(valueToReturn)
  
    // if the path exists
    existSpy.and.returnValue(true);
    component.nodeMoved('test', component.tree.root.children[0]);

    expect(getContentSpy.calls.first().args[0]).toBe('test');
    expect(removeContentSpy.calls.first().args[0]).toBe('test');
    expect(setContentSpy.calls.first().args[0]).toBe(component.tree.root.children[0].path);
    expect(setContentSpy.calls.first().args[1]).toBe(valueToReturn);

    setContentSpy.calls.reset();
    
    // if the path doesn't exists
    existSpy.and.returnValue(false);
    component.nodeMoved('test', component.tree.root.children[0]);
    expect(setContentSpy.calls.count()).toBe(0);
  }))

  it('nodeUploaded()', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);

    let existSpy = spyOn(component.editor, 'exist');
    let removeContentSpy = spyOn(component.editor, 'removeContent');
    let setContentSpy = spyOn(component.editor, 'setContent');

    existSpy.and.returnValue(true);
    let arg = {base64: 'aGVsbG8gd29ybGQh', node: component.tree.root.children[0]};
    component.nodeUploaded(arg);

    expect(setContentSpy.calls.first().args[0]).toBe(arg.node.path);
    expect(setContentSpy.calls.first().args[1]).toBe('hello world!');

    setContentSpy.calls.reset();
    arg = {base64: 'aGVsbG8gd29ybGQh', node: component.tree.root.children[5].children[1].children[0]};
    component.nodeUploaded(arg);

    expect(setContentSpy.calls.first().args[0]).toBe(arg.node.path);
    expect(setContentSpy.calls.first().args[1]).toBe('aGVsbG8gd29ybGQh');
    tick(10000);
  }))
});

describe('WorkspaceComponent with WorkspaceService', () => {
  let component: WorkspaceComponent;
  let fixture: ComponentFixture<WorkspaceComponent>;
  let routerSpy;
  let routeStub;
  let wrapperServiceSpy;
  let repositoryDetailsSpy;
  let branchesSpy;
  let treeSpy;
  let getBlobSpy;
  let getPageBranchSpy;
  let matDialogSpy;
  let workspaceService: WorkspaceService;

  function mockWrapperServiceSpy(){
    repositoryDetailsSpy.and.returnValue(Promise.resolve(repositoryDetails));
    branchesSpy.and.returnValue(Promise.resolve(branches));
    treeSpy.and.returnValue(Promise.resolve(tree));
    getBlobSpy.and.returnValue(Promise.resolve(blob1));
    getPageBranchSpy.and.returnValue(Promise.resolve());
  }

  beforeEach(async(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routeStub = new ActivatedRouteStub({});
    routeStub.setParamMap({userId: 'id', repositoryName: 'repo'});
    routeStub.setQueryParamMap( {branch:'master'});    
    wrapperServiceSpy = jasmine.createSpyObj('WrapperService', ['repositoryDetails', 'branches', 'tree', 'getBlob', 'getPageBranch']);
    repositoryDetailsSpy = wrapperServiceSpy.repositoryDetails;
    branchesSpy = wrapperServiceSpy.branches;
    treeSpy = wrapperServiceSpy.tree;
    getBlobSpy = wrapperServiceSpy.getBlob;
    getPageBranchSpy = wrapperServiceSpy.getPageBranch;
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);
    mockWrapperServiceSpy();
    TestBed.configureTestingModule({
      declarations: [MarkdownStubEditorComponent, WorkspaceComponent, GithubTreeComponent, UploadComponent, EditorStubComponent, ActionComponent, StageComponent, CommitProgressComponent, TabComponent],
      providers: [{provide: ActivatedRoute, useValue: routeStub}, 
        {provide: WrapperService, useValue: wrapperServiceSpy}, 
        {provide: Router, useValue: routerSpy},
        {provide: MatDialog, useValue: matDialogSpy},
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
        MatTabsModule,
        DeviceDetectorModule.forRoot(),
        FlexLayoutModule
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceComponent);
    workspaceService = TestBed.get(WorkspaceService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('ngOnInit()', () => {
    fixture.detectChanges();
  })
  
  it('SelectNode() from service', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);

    let nodeSelectedSpy = spyOn(component, 'nodeSelected');
    let existSpy = spyOn(component.editor, 'exist');
    existSpy.and.returnValue(false);

    workspaceService.selectNode(undefined, '.buildinfo')
    fixture.detectChanges();
    tick(10000);

    expect(nodeSelectedSpy.calls.count()).toBe(1);
  }))
  
  it('RemoveNode() from service', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);
    
    let nodeRemovedSpy = spyOn(component, 'nodeRemoved');

    // let testNode = Object.assign({}, tree.tree[0]);
    // testNode.path = '.buildinfo';

    workspaceService.removeNode(undefined, '.buildinfo');
    fixture.detectChanges();
    tick(10000);

    expect(nodeRemovedSpy.calls.count()).toBe(1);
  }))

  it('CreateNode() from service', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);
    
    let nodeCreatedSpy = spyOn(component, 'nodeCreated');

    let testNode = Object.assign({}, tree.tree[0]);
    testNode.path = '.buildinfo';

    workspaceService.createNode(undefined, GithubTreeNode.githubTreeNodeFactory.of(testNode));
    fixture.detectChanges();
    tick(10000);

    expect(nodeCreatedSpy.calls.count()).toBe(1);
  }))
  
  it('MoveNodeInTree() from service', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);

    let nodeMovedSpy = spyOn(component, 'nodeMoved');

    let testNode = Object.assign({}, tree.tree[0]);
    testNode.path = 'newfile.txt';

    workspaceService.moveNodeInTree(undefined, 'oldfile.txt', GithubTreeNode.githubTreeNodeFactory.of(testNode))
    fixture.detectChanges();
    tick(10000);

    expect(nodeMovedSpy.calls.count()).toBe(1);
  }))
  
  it('NotifyContentChange() from service', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);

    let nodeContentChangedSpy = spyOn(component, 'nodeContentChanged');

    workspaceService.notifyContentChange(undefined, 'newfile.txt')
    fixture.detectChanges();
    tick(10000);

    expect(nodeContentChangedSpy.calls.count()).toBe(1);
    expect(nodeContentChangedSpy.calls.first().args[0]).toBe('newfile.txt');
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
