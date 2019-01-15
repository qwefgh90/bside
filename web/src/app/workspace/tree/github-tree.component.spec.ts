import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { GithubTreeComponent } from './github-tree.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { TreeModule, TreeNode } from 'angular-tree-component';
import { tree, repositoryDetails } from 'src/app/testing/mock-data';
import { SimpleChange } from '@angular/core';
import { NodeStateAction } from './github-tree-node';
import { GithubTreeToTree } from './github-tree-to-tree';
import { LocalUploadService } from '../upload/local-upload.service';
import { UploadComponent } from '../upload/upload.component';
import { UploadFile } from '../upload/upload-file';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
describe('TreeComponent', () => {
  let component: GithubTreeComponent;
  let fixture: ComponentFixture<GithubTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GithubTreeComponent, UploadComponent ],
      imports: [
        TreeModule.forRoot(),
        MatIconModule,
        MatButtonModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatDividerModule, 
        MatInputModule,
        BrowserAnimationsModule
      ]
      ,providers: [{provide: LocalUploadService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GithubTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('repository', () => {
    component.repository = repositoryDetails;
    fixture.detectChanges();
    let name = fixture.nativeElement.querySelector('.repository-title-box > span').textContent;
    expect(repositoryDetails.name).toBe(name.trim());
  });

  it('render tree', () => {
    component.repository = repositoryDetails;
    const nodeTransformer = new GithubTreeToTree(tree);
    const hiarachyTree = nodeTransformer.getTree();
    component.tree = hiarachyTree;
    component.ngOnChanges({"tree": new SimpleChange(undefined, tree, false)})

    fixture.detectChanges();
    const levelOneNodes = tree.tree.filter(e => {
      return !e.path.includes("/");
    });
    let treeNodes = fixture.nativeElement.querySelectorAll('tree-node');
    expect(treeNodes.length).toBe(levelOneNodes.length);
  });

  it('click one node', () => {
    component.repository = repositoryDetails;
    const nodeTransformer = new GithubTreeToTree(tree);
    const hiarachyTree = nodeTransformer.getTree();
    component.tree = hiarachyTree;
    component.ngOnChanges({"tree": new SimpleChange(undefined, tree, false)})
    fixture.detectChanges();
    
    let treeNodes: NodeList = fixture.nativeElement.querySelectorAll('.node-title');
    let e1: HTMLDivElement = (treeNodes[0] as HTMLDivElement);
    e1.click();    
    fixture.detectChanges();

    expect(component.selectedNode.data.name).toBe(tree.tree[0].path);
  });


  it('move node under the root in the function of drop()', () => {
    component.repository = repositoryDetails;
    const nodeTransformer = new GithubTreeToTree(tree);
    const hiarachyTree = nodeTransformer.getTree();
    component.tree = hiarachyTree;
    component.ngOnChanges({"tree": new SimpleChange(undefined, tree, false)})
    fixture.detectChanges();
    
    let oneChild = component.root.children[5].children[0];
    let pathBefore = oneChild.path
    oneChild.move(component.root);
    expect(oneChild.state.find((v) => v == NodeStateAction.Moved)).toBeDefined();
    expect(oneChild.getParentNode().state.find((v) => v == NodeStateAction.NodesChanged)).toBeDefined();
    expect(component.root.state.find((v) => v == NodeStateAction.NodesChanged)).toBeDefined();
    let pathAfter = oneChild.path

    expect(pathBefore).not.toBe(pathAfter);
    expect(oneChild.path).toBe(oneChild.name);
  });

  it('findInSiblings()', () => {
    component.repository = repositoryDetails;
    const nodeTransformer = new GithubTreeToTree(tree);
    const hiarachyTree = nodeTransformer.getTree();
    component.tree = hiarachyTree;
    component.ngOnChanges({"tree": new SimpleChange(undefined, tree, false)})
    fixture.detectChanges();

    let model = component.treeComponent.treeModel;
    let node: TreeNode = model.roots[0];
    let count = 0;
    component.findInSiblings(node, (n) => {
      count++;
      return false;
    });

    expect(count).toBe(5);
  });

  it('newNode()', () => {
    fixture.detectChanges();

    component.repository = repositoryDetails;
    const nodeTransformer = new GithubTreeToTree(tree);
    const hiarachyTree = nodeTransformer.getTree();
    component.tree = hiarachyTree;
    component.ngOnChanges({"tree": new SimpleChange(undefined, tree, false)})
    fixture.detectChanges();

    let model = component.treeComponent.treeModel;
    let _downloads: TreeNode = model.roots[5];
    let beforeLen = _downloads.data.children.length
    try{
      component.newNode('blob', _downloads);
    }catch(e){}
    component.renamingFormControl.setValue("newname");
    component.completeRenaming();
    fixture.detectChanges();
    
    expect(_downloads.data.children.length).toBe(beforeLen + 1);
  });

  it('newNode() with the name', () => {
    fixture.detectChanges();

    component.repository = repositoryDetails;
    const nodeTransformer = new GithubTreeToTree(tree);
    const hiarachyTree = nodeTransformer.getTree();
    component.tree = hiarachyTree;
    component.ngOnChanges({"tree": new SimpleChange(undefined, tree, false)})
    fixture.detectChanges();

    let model = component.treeComponent.treeModel;
    let _downloads: TreeNode = model.roots[5];
    let beforeLen = _downloads.data.children.length
    try{
      component.newNode('blob', _downloads, "newnode");
    }catch(e){}
    component.renamingFormControl.setValue("newname");
    component.completeRenaming();
    fixture.detectChanges();
    
    expect(_downloads.data.children.length).toBe(beforeLen + 1);
  });
  
  it('onFileLoaded()', () => {
    fixture.detectChanges();

    component.repository = repositoryDetails;
    const nodeTransformer = new GithubTreeToTree(tree);
    const hiarachyTree = nodeTransformer.getTree();
    component.tree = hiarachyTree;
    component.ngOnChanges({"tree": new SimpleChange(undefined, tree, false)})
    fixture.detectChanges();

    let model = component.treeComponent.treeModel;
    let _downloads: TreeNode = model.roots[5];
    let beforeLen = _downloads.data.children.length
    try{
      const fileToBeUploaded = new UploadFile(_downloads.data.path, 'uploadedFile', '', 0, '');
      component.onFileLoaded(fileToBeUploaded);
    }catch(e){}
    fixture.detectChanges();
    expect(_downloads.data.children.length).toBe(beforeLen + 1);
  });

  it('onFileLoaded() with the existing name', () => {
    fixture.detectChanges();

    component.repository = repositoryDetails;
    const nodeTransformer = new GithubTreeToTree(tree);
    const hiarachyTree = nodeTransformer.getTree();
    component.tree = hiarachyTree;
    component.ngOnChanges({"tree": new SimpleChange(undefined, tree, false)})
    fixture.detectChanges();

    let model = component.treeComponent.treeModel;
    let _downloads: TreeNode = model.roots[5];
    let beforeLen = _downloads.data.children.length
    try{
      const fileToBeUploaded = new UploadFile(_downloads.data.path, '376fff9bd23db6ea14d201f2479fb500', '', 0, '');
      component.onFileLoaded(fileToBeUploaded);
    }catch(e){}
    fixture.detectChanges();
    expect(_downloads.data.children.length).toBe(beforeLen);
  });

  it('newNode() with empty name', () => {
    fixture.detectChanges();

    component.repository = repositoryDetails;
    const nodeTransformer = new GithubTreeToTree(tree);
    const hiarachyTree = nodeTransformer.getTree();
    component.tree = hiarachyTree;
    component.ngOnChanges({"tree": new SimpleChange(undefined, tree, false)})
    fixture.detectChanges();

    let model = component.treeComponent.treeModel;
    let _downloads: TreeNode = model.roots[5];
    let beforeLen = _downloads.data.children.length
    try{
      component.newNode('blob', _downloads);
    }catch(e){}
    component.renamingFormControl.setValue("");
    component.completeRenaming();
    fixture.detectChanges();
    
    expect(_downloads.data.children.length).toBe(beforeLen);
  });

  it('newNode() with undefined name', () => {
    fixture.detectChanges();

    component.repository = repositoryDetails;
    const nodeTransformer = new GithubTreeToTree(tree);
    const hiarachyTree = nodeTransformer.getTree();
    component.tree = hiarachyTree;
    component.ngOnChanges({"tree": new SimpleChange(undefined, tree, false)})
    fixture.detectChanges();

    let model = component.treeComponent.treeModel;
    let _downloads: TreeNode = model.roots[5];
    let beforeLen = _downloads.data.children.length
    try{
      component.newNode('blob', _downloads);
    }catch(e){}
    component.renamingFormControl.setValue(undefined);
    component.completeRenaming();
    fixture.detectChanges();
    
    expect(_downloads.data.children.length).toBe(beforeLen);
  });


  it('newNode() with duplicate name', () => {
    fixture.detectChanges();

    component.repository = repositoryDetails;
    const nodeTransformer = new GithubTreeToTree(tree);
    const hiarachyTree = nodeTransformer.getTree();
    component.tree = hiarachyTree;
    component.ngOnChanges({"tree": new SimpleChange(undefined, tree, false)})
    fixture.detectChanges();

    let model = component.treeComponent.treeModel;
    let _downloads: TreeNode = model.roots[5];
    let beforeLen = _downloads.data.children.length
    try{
      component.newNode('blob', _downloads);
    }catch(e){}
    component.renamingFormControl.setValue("376fff9bd23db6ea14d201f2479fb500");
    component.completeRenaming();
    fixture.detectChanges();
    
    expect(_downloads.data.children.length).toBe(beforeLen);
  });

  
});
