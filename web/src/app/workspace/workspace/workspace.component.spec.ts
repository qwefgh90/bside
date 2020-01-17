import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { WorkspaceComponent, TreeStatusOnWorkspace } from './workspace.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { WrapperService } from 'src/app/github/wrapper.service';
import { ActionComponent } from '../action/action.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeModule } from 'angular-tree-component';
import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { repositoryDetails, branches, tree, blob1, tree2, commit1 } from 'src/app/testing/mock-data';
import { MonacoService } from '../editor/monaco.service';
import { Component, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { GithubTreeNode, NodeStateAction } from '../tree/github-tree-node';
import { FileType, TextUtil } from '../text/text-util';
import { LocalUploadService } from '../upload/local-upload.service';
import { UploadComponent } from '../upload/upload.component';
import { GithubTreeComponent } from '../tree/github-tree.component';
import { Editor } from '../editor/editor';
import { CommitProgressComponent } from './commit-progress/commit-progress.component';
import { TabComponent } from '../tab/tab.component';
import { DatabaseToken } from 'src/app/db/database';
import { LocalDbService } from 'src/app/db/local-db.service';
import { DeviceDetectorModule, DeviceDetectorService } from 'ngx-device-detector';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GithubTreeToTree } from '../tree/github-tree-to-tree';
import { SelectAction } from '../core/action/user/select-action';
import { FileRenameAction } from '../core/action/user/file-rename-action';
import { RemoveNodeAction } from '../core/action/user/remove-node-action';
import { UserActionDispatcher } from '../core/action/user/user-action-dispatcher';
import { CreateAction } from '../core/action/user/create-action';
import { NotifyContentChangeAction } from '../core/action/user/notify-content-change-action';
import { MatCheckboxModule, MatTooltipModule } from '@angular/material';

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
  select(path: string): boolean{
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
  select(path: string): boolean{
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
  let getResponseSpy;
  let matDialogSpy;
  let dispatcher;

  function mockWrapperServiceSpy(){
    repositoryDetailsSpy.and.returnValue(Promise.resolve(repositoryDetails));
    branchesSpy.and.returnValue(Promise.resolve(branches));
    treeSpy.and.returnValue(Promise.resolve(tree));
    getBlobSpy.and.returnValue(Promise.resolve(blob1));
    getPageBranchSpy.and.returnValue(Promise.resolve());
    getResponseSpy.and.returnValue(Promise.resolve({body: commit1}));
  }

  beforeEach(async(() => {
    dispatcher = new UserActionDispatcher();
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routeStub = new ActivatedRouteStub({});
    routeStub.setParamMap({userId: 'id', repositoryName: 'repo'});
    routeStub.setQueryParamMap( {branch:'master'});    
    wrapperServiceSpy = jasmine.createSpyObj('WrapperService', ['repositoryDetails', 'branches', 'tree', 'getBlob', 'getPageBranch', 'getResponse']);
    repositoryDetailsSpy = wrapperServiceSpy.repositoryDetails;
    branchesSpy = wrapperServiceSpy.branches;
    treeSpy = wrapperServiceSpy.tree;
    getBlobSpy = wrapperServiceSpy.getBlob;
    getPageBranchSpy = wrapperServiceSpy.getPageBranch;
    getResponseSpy = wrapperServiceSpy.getResponse;
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);
    mockWrapperServiceSpy();
    TestBed.configureTestingModule({
      declarations: [MarkdownStubEditorComponent, WorkspaceComponent, GithubTreeComponent, UploadComponent, EditorStubComponent, ActionComponent, StageComponent, CommitProgressComponent, TabComponent],
      providers: [{provide: ActivatedRoute, useValue: routeStub}, 
        {provide: WrapperService, useValue: wrapperServiceSpy}, 
        {provide: Router, useValue: routerSpy},
        {provide: MatDialog, useValue: matDialogSpy},
        {provide: MonacoService}, {provide: LocalUploadService},
        {provide: DatabaseToken, useClass: LocalDbService},
        {provide: UserActionDispatcher, useValue: dispatcher}
      ],
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
        FlexLayoutModule,
        MatCheckboxModule,
        MatTooltipModule
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

  it('define components', fakeAsync(() => {
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
    let selectSpy = spyOn(component.editor, 'select');
    let existSpy = spyOn(component.editor, 'exist');
    existSpy.and.returnValue(false);

    let treeNodes = fixture.nativeElement.querySelectorAll('tree-node .node-title');
    treeNodes[0].click();
    fixture.detectChanges();
    tick(10000);

    expect(component.selectedNodePath).toBeDefined();
    expect(selectSpy.calls.first().args[0]).toBe(tree.tree[0].path);
    
    expect(setContentSpy.calls.count()).toBe(1);
    let pathArg = setContentSpy.calls.first().args[0];
    let contentArg = setContentSpy.calls.first().args[1];
    expect(tree.tree[0].path).toBe(pathArg);
    expect(TextUtil.base64ToString(blob1.content)).toBe(contentArg);
    tick(15000);
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
    let selectSpy = spyOn(component.editor, 'select');
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
    tick(16000);

    setContentSpy.calls.reset();
    arg = {base64: 'aGVsbG8gd29ybGQh', node: component.tree.root.children[5].children[1].children[0]};
    component.nodeUploaded(arg);

    expect(setContentSpy.calls.first().args[0]).toBe(arg.node.path);
    expect(setContentSpy.calls.first().args[1]).toBe('aGVsbG8gd29ybGQh');
    tick(16000);
  }))

  it('compactByCuttingUnchangedBlobs() after remove() and modify()', () =>{
    let transformer = new GithubTreeToTree(tree2);
    let root = transformer.getTree();
    let result = transformer.getTree().children;
    expect(result.length).toBe(6);
    const markdown = result[4];
    const subpage = markdown.children[2];
    const subpage2 = markdown.children[3];
    const source = result[5];
    const meta = source.children[2];
    const person = meta.children[2];
    
    let blobs = root.getBlobNodes().filter(n => !n.state.includes(NodeStateAction.Deleted));
    let compacted = component.compactByCuttingUnchangedBlobs(blobs, root);
    expect(compacted.length).toBe(1);
    expect(compacted[0].path).toBe('');
        
    //modify one file
    result[0].setContentModifiedFlag(true);

    blobs = root.getBlobNodes().filter(n => !n.state.includes(NodeStateAction.Deleted));
    compacted = component.compactByCuttingUnchangedBlobs(blobs, root);

    expect(compacted.length).toBe(6);
    expect(compacted[0].path).toBe('a.txt');
    expect(compacted[1].path).toBe('abcd');
    expect(compacted[2].path).toBe('b.md');
    expect(compacted[3].path).toBe('c.txt');
    expect(compacted[4].path).toBe('markdown');
    expect(compacted[5].path).toBe('source');

    //remove a additinal file
    subpage.children[0].remove();
    blobs = root.getBlobNodes().filter(n => !n.state.includes(NodeStateAction.Deleted));
    compacted = component.compactByCuttingUnchangedBlobs(blobs, root);

    expect(compacted.length).toBe(9);
    expect(compacted[0].path).toBe('a.txt');
    expect(compacted[1].path).toBe('abcd');
    expect(compacted[2].path).toBe('b.md');
    expect(compacted[3].path).toBe('c.txt');
    expect(compacted[4].path).toBe('markdown/md1.md');
    expect(compacted[5].path).toBe('markdown/post1.md');
    expect(compacted[6].path).toBe('markdown/subpage/head.txt');
    expect(compacted[7].path).toBe('markdown/subpage2');
    expect(compacted[8].path).toBe('source');

    source.children[0].setContentModifiedFlag(true)
    blobs = root.getBlobNodes().filter(n => !n.state.includes(NodeStateAction.Deleted));
    compacted = component.compactByCuttingUnchangedBlobs(blobs, root);

    expect(compacted.length).toBe(11);
    expect(compacted[0].path).toBe('a.txt');
    expect(compacted[1].path).toBe('abcd');
    expect(compacted[2].path).toBe('b.md');
    expect(compacted[3].path).toBe('c.txt');
    expect(compacted[4].path).toBe('markdown/md1.md');
    expect(compacted[5].path).toBe('markdown/post1.md');
    expect(compacted[6].path).toBe('markdown/subpage/head.txt');
    expect(compacted[7].path).toBe('source/a.java');
    expect(compacted[8].path).toBe('source/b.java');
    expect(compacted[9].path).toBe('markdown/subpage2');
    expect(compacted[10].path).toBe('source/meta');
  })

  it('compactByCuttingUnchangedBlobs() after rename()', () =>{
    let transformer = new GithubTreeToTree(tree2);
    let root = transformer.getTree();
    let result = transformer.getTree().children;
    expect(result.length).toBe(6);
    const markdown = result[4];
    const subpage = markdown.children[2];
    const subpage2 = markdown.children[3];
    const source = result[5];
    const meta = source.children[2];
    const person = meta.children[2];
    
    let blobs = root.getBlobNodes().filter(n => !n.state.includes(NodeStateAction.Deleted));
    let compacted = component.compactByCuttingUnchangedBlobs(blobs, root);
    expect(compacted.length).toBe(1);
    expect(compacted[0].path).toBe('');
        
    //rename one file
    person.rename('newperson');

    blobs = root.getBlobNodes().filter(n => !n.state.includes(NodeStateAction.Deleted));
    compacted = component.compactByCuttingUnchangedBlobs(blobs, root);

    expect(compacted.length).toBe(11);
    expect(compacted[0].path).toBe('a.txt');
    expect(compacted[1].path).toBe('abcd');
    expect(compacted[2].path).toBe('b.md');
    expect(compacted[3].path).toBe('c.txt');
    expect(compacted[4].path).toBe('source/a.java');
    expect(compacted[5].path).toBe('source/b.java');
    expect(compacted[6].path).toBe('source/meta/class.txt');
    expect(compacted[7].path).toBe('source/meta/con.txt');
    expect(compacted[8].path).toBe('source/meta/newperson/age.txt');
    expect(compacted[9].path).toBe('source/meta/newperson/list.txt');
    expect(compacted[10].path).toBe('markdown');
  })

  it('compactByCuttingUnchangedBlobs() after move()', () =>{
    let transformer = new GithubTreeToTree(tree2);
    let root = transformer.getTree();
    let result = transformer.getTree().children;
    expect(result.length).toBe(6);
    const markdown = result[4];
    const subpage = markdown.children[2];
    const subpage2 = markdown.children[3];
    const source = result[5];
    const meta = source.children[2];
    const person = meta.children[2];
    
    let blobs = root.getBlobNodes().filter(n => !n.state.includes(NodeStateAction.Deleted));
    let compacted = component.compactByCuttingUnchangedBlobs(blobs, root);
    expect(compacted.length).toBe(1);
    expect(compacted[0].path).toBe('');
        
    //move one file
    result[0].move(markdown);

    blobs = root.getBlobNodes().filter(n => !n.state.includes(NodeStateAction.Deleted));
    compacted = component.compactByCuttingUnchangedBlobs(blobs, root);

    expect(compacted.length).toBe(9);
    expect(compacted[0].path).toBe('markdown/a.txt');
    expect(compacted[1].path).toBe('abcd');
    expect(compacted[2].path).toBe('b.md');
    expect(compacted[3].path).toBe('c.txt');
    expect(compacted[4].path).toBe('markdown/md1.md');
    expect(compacted[5].path).toBe('markdown/post1.md');
    expect(compacted[6].path).toBe('markdown/subpage');
    expect(compacted[7].path).toBe('markdown/subpage2');
    expect(compacted[8].path).toBe('source');

  })

  it('compactByCuttingUnchangedBlobs() after setUploadedToLocal()', () =>{
    let transformer = new GithubTreeToTree(tree2);
    let root = transformer.getTree();
    let result = transformer.getTree().children;
    expect(result.length).toBe(6);
    const markdown = result[4];
    const subpage = markdown.children[2];
    const subpage2 = markdown.children[3];
    const source = result[5];
    const meta = source.children[2];
    const person = meta.children[2];
    
    let blobs = root.getBlobNodes().filter(n => !n.state.includes(NodeStateAction.Deleted));
    let compacted = component.compactByCuttingUnchangedBlobs(blobs, root);
    expect(compacted.length).toBe(1);
    expect(compacted[0].path).toBe('');
        
    //upload one file
    subpage.children[0].setUploadedToLocal();

    blobs = root.getBlobNodes().filter(n => !n.state.includes(NodeStateAction.Deleted));
    compacted = component.compactByCuttingUnchangedBlobs(blobs, root);

    expect(compacted.length).toBe(10);
    expect(compacted[0].path).toBe('a.txt');
    expect(compacted[1].path).toBe('abcd');
    expect(compacted[2].path).toBe('b.md');
    expect(compacted[3].path).toBe('c.txt');
    expect(compacted[4].path).toBe('markdown/md1.md');
    expect(compacted[5].path).toBe('markdown/post1.md');
    expect(compacted[6].path).toBe('markdown/subpage/author.txt');
    expect(compacted[7].path).toBe('markdown/subpage/head.txt');
    expect(compacted[8].path).toBe('markdown/subpage2');
    expect(compacted[9].path).toBe('source');

  })
});

describe('WorkspaceComponent with UserAction', () => {
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
  let getResponseSpy;
  let matDialogSpy;
  let dispatcher;
  let database;

  function mockWrapperServiceSpy(){
    repositoryDetailsSpy.and.returnValue(Promise.resolve(repositoryDetails));
    branchesSpy.and.returnValue(Promise.resolve(branches));
    treeSpy.and.returnValue(Promise.resolve(tree));
    getBlobSpy.and.returnValue(Promise.resolve(blob1));
    getPageBranchSpy.and.returnValue(Promise.resolve());
    getResponseSpy.and.returnValue(Promise.resolve({body: commit1}));
  }

  beforeEach(async(() => {
    dispatcher = new UserActionDispatcher();
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routeStub = new ActivatedRouteStub({});
    routeStub.setParamMap({userId: 'id', repositoryName: 'repo'});
    routeStub.setQueryParamMap( {branch:'master'});    
    wrapperServiceSpy = jasmine.createSpyObj('WrapperService', ['repositoryDetails', 'branches', 'tree', 'getBlob', 'getPageBranch', 'getResponse']);
    repositoryDetailsSpy = wrapperServiceSpy.repositoryDetails;
    branchesSpy = wrapperServiceSpy.branches;
    treeSpy = wrapperServiceSpy.tree;
    getBlobSpy = wrapperServiceSpy.getBlob;
    getPageBranchSpy = wrapperServiceSpy.getPageBranch;
    getResponseSpy = wrapperServiceSpy.getResponse;
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);
    mockWrapperServiceSpy();
    TestBed.configureTestingModule({
      declarations: [MarkdownStubEditorComponent, WorkspaceComponent, GithubTreeComponent, UploadComponent, EditorStubComponent, ActionComponent, StageComponent, CommitProgressComponent, TabComponent],
      providers: [{provide: ActivatedRoute, useValue: routeStub}, 
        {provide: WrapperService, useValue: wrapperServiceSpy}, 
        {provide: Router, useValue: routerSpy},
        {provide: MatDialog, useValue: matDialogSpy},
      {provide: MonacoService}, {provide: LocalUploadService},
      {provide: DatabaseToken, useClass: LocalDbService},
      {provide: UserActionDispatcher, useValue: dispatcher}
    ],
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
        FlexLayoutModule,
        MatCheckboxModule,
        MatTooltipModule
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceComponent);
    database = TestBed.get(DatabaseToken);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('ngOnInit()', () => {
    fixture.detectChanges();
  })

  it('autosave enabled', fakeAsync(() => {
    let saveSpy = spyOn(database, 'save');
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);

    component.autoSaveRef.checked = true;
    new SelectAction('.buildinfo', undefined, dispatcher).start();

    fixture.detectChanges();
    tick(10000);
    expect(saveSpy.calls.count()).toBe(1);
    tick(15000);
  }))

  it('autosave disabled', fakeAsync(() => {
    let saveSpy = spyOn(database, 'save');
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);

    component.autoSaveRef.checked = false;
    new SelectAction('.buildinfo', undefined, dispatcher).start();

    fixture.detectChanges();
    tick(10000);
    expect(saveSpy.calls.count()).toBe(0);
    tick(18000);
    expect(saveSpy.calls.count()).toBe(1);
  }))

  it('SelectAction', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);

    let nodeSelectedSpy = spyOn(component, 'nodeSelected');
    let existSpy = spyOn(component.editor, 'exist');
    existSpy.and.returnValue(false);
    new SelectAction('.buildinfo', undefined, dispatcher).start();

    fixture.detectChanges();
    tick(10000);
    expect(nodeSelectedSpy.calls.count()).toBe(1);
    tick(15000);
  }))
  
  it('RemoveNodeAction', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);
    
    let nodeRemovedSpy = spyOn(component, 'nodeRemoved');
    new RemoveNodeAction( '.buildinfo', undefined, dispatcher).start();
    
    fixture.detectChanges();
    tick(10000);
    expect(nodeRemovedSpy.calls.count()).toBe(1);
    tick(15000);
  }))

  it('CreateAction', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);

    let nodeCreatedSpy = spyOn(component, 'nodeCreated');
    let testNode = Object.assign({}, tree.tree[0]);
    testNode.path = '.buildinfo';
    new CreateAction(testNode.path, this, dispatcher).start();

    fixture.detectChanges();
    tick(10000);
    expect(nodeCreatedSpy.calls.count()).toBe(1);
    tick(15000);
  }))
  
  it('FileRenameAction', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);

    let nodeMovedSpy = spyOn(component, 'nodeMoved');
    let testNode = Object.assign({}, tree.tree[0]);
    testNode.path = 'newfile.txt';

    new FileRenameAction('oldfile.txt','oldfile.txt','newfile.txt','newfile.txt', undefined, dispatcher).start();
    fixture.detectChanges();
    tick(10000);
    expect(nodeMovedSpy.calls.count()).toBe(1);
    tick(15000);
  }))
  
  it('NotifyContentChangeAction', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);

    let nodeContentChangedSpy = spyOn(component, 'nodeContentChanged');

    new NotifyContentChangeAction('newfile.txt', this, dispatcher).start();
    fixture.detectChanges();
    tick(10000);

    expect(nodeContentChangedSpy.calls.count()).toBe(1);
    expect(nodeContentChangedSpy.calls.first().args[0]).toBe('newfile.txt');
    tick(15000);
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
