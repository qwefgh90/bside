import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, AfterContentInit, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { WrapperService } from 'src/app/github/wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject, Observable, combineLatest, fromEventPattern } from 'rxjs';
import { MatDrawer, MatSelectChange } from '@angular/material';
import { GithubTreeNode, NodeStateAction } from '../tree/github-tree-node';
import { MonacoService } from '../editor/monaco.service';
import { Editor } from '../editor/editor';
import { Blob } from 'src/app/github/type/blob';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileType, TextUtil } from '../text/text-util';
import { GithubTree } from '../tree/github-tree';
import { Stage } from '../stage/stage';

declare const monaco;

export enum TreeStatusOnWorkspace{
  Loading, NotInitialized, Done, Fail
}

export enum ContentStatusOnWorkspace{
  Loading, NotInitialized, Done, Fail
}

export enum WorkspaceStatus{
  View, Stage
}

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit, OnDestroy, AfterContentInit {
  FileType = FileType;
  TreeStatus = TreeStatusOnWorkspace;
  ContentStatus = ContentStatusOnWorkspace;
  WorkspaceStatus = WorkspaceStatus;
  constructor(private wrapper: WrapperService, private monacoService: MonacoService, private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer) { 
    console.log("new comp");
  }

  @ViewChild("tree") tree: GithubTree;
  @ViewChild("editor1") editor1: Editor;
  @ViewChild("stage") stage: Stage;

  userId;
  repositoryName;
  repositoryDetails;
  branches: Array<any>;
  selectedBranch;
  flatTree: any
  rootToStage: GithubTreeNode;

  selectedNode: GithubTreeNode;
  mimeName: string;
  encoding: string;
  selectedFileType: FileType;
  selectedImagePath: SafeResourceUrl;

  initialized = false;
  contentStatus: ContentStatusOnWorkspace = ContentStatusOnWorkspace.NotInitialized;
  treeStatus: TreeStatusOnWorkspace = TreeStatusOnWorkspace.NotInitialized;
  workspaceStatus: WorkspaceStatus = WorkspaceStatus.View;

  subscriptions: Array<Subscription> = []

  @ViewChild("leftDrawer") leftPane: MatDrawer;
  @ViewChild("rightDrawer") rightPane: MatDrawer;

  ngOnInit() {
    this.initalizeLoader();
    if(this.route.snapshot.queryParams['branch'] == undefined){
      const userId = this.route.snapshot.params['userId']
      const repositoryName = this.route.snapshot.params['repositoryName']
      const branchName = this.route.snapshot.queryParams['branch']
      if(userId != undefined && repositoryName != undefined){
        this.userId = userId;
        this.repositoryName = repositoryName;
        this.initialzeWorkspace(this.userId, this.repositoryName, branchName).finally(() => {
          this.treeStatus = TreeStatusOnWorkspace.Done;
        })
      }else
        this.treeStatus = TreeStatusOnWorkspace.Fail;
    }else
      this.treeStatus = TreeStatusOnWorkspace.Fail;
    let s = combineLatest(this.route.paramMap, this.route.queryParamMap).subscribe(([p, q]) => {
      const branchName = this.route.snapshot.queryParams['branch'];
      if (p.has('userId') && p.has('repositoryName')) {
        this.userId = p.get('userId');
        this.repositoryName = p.get('repositoryName');
        this.initialzeWorkspace(this.userId, this.repositoryName, branchName).finally(() => { 
          this.treeStatus = TreeStatusOnWorkspace.Done;
        });
      }else{
        this.treeStatus = TreeStatusOnWorkspace.Fail;
      }
    });
    this.subscriptions.push(s);
  }

  private initalizeLoader(){
    if (!(window as any).require) {
      const loaderScript = document.createElement("script");
      loaderScript.type = "text/javascript";
      loaderScript.src = "vs/loader.js";
      loaderScript.addEventListener("load", () => {
        (window as any).require(["vs/editor/editor.main"], () => {
          this.monacoService.monaco.next(monaco);
        });
      });
      document.body.appendChild(loaderScript);
    }
  }

  ngAfterContentInit() {
    this.toggle();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscribe =>
      subscribe.unsubscribe());
  }

  toggle() {
    this.leftPane.toggle();
    this.rightPane.toggle();
  }

  newNode(node: GithubTreeNode){

  }

  getImage(base64: string, mediaType: string): SafeResourceUrl{
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:${mediaType};base64,${base64}`);
  }

  getRawUrl(fullName: string, commitSha: string, path: string): SafeResourceUrl{
    return `https://raw.githubusercontent.com/${fullName}/${commitSha}/${path}`;
  }

  nodeSelected(node: GithubTreeNode) {
    if (node.type == 'blob') {
      this.selectedNode = node;
      this.contentStatus = ContentStatusOnWorkspace.Loading;
      this.mimeName = TextUtil.getMime(node.name);
      let type = TextUtil.getFileType(this.selectedNode.name);
      this.selectedFileType = type;
      if (this.selectedNode.state.filter((v) => v == NodeStateAction.Created).length > 0) {
        if (type == FileType.Text) {
          let bytes = TextUtil.base64ToBytes('');
          this.encoding = 'utf-8';
          this.setContentAndFocusInEditor(this.selectedNode.path, bytes, this.encoding);
        }
        this.contentStatus = ContentStatusOnWorkspace.Done;
      } else {
        this.wrapper.getBlob(this.userId, this.repositoryName, this.selectedNode.sha).then(
          (blob: Blob) => {
            console.log('mimeName: '+ this.mimeName)
            if(type == FileType.Image){
              this.selectedImagePath = this.getRawUrl(this.repositoryDetails.full_name, this.selectedBranch.commit.sha, this.selectedNode.syncedNode.path);
            } else if (type == FileType.Text) {
              let bytes = TextUtil.base64ToBytes(blob.content);
              this.encoding = TextUtil.getEncoding(bytes)
              this.setContentAndFocusInEditor(this.selectedNode.path, bytes, this.encoding);
            }
          }, (reason) => {
            console.debug("An error during getting blob. Maybe selectedNode is invalid.");
            console.debug(this.selectedNode);
          }
        ).finally(() => {
          this.contentStatus = ContentStatusOnWorkspace.Done;
        });
      }
    }
  }

  private setContentAndFocusInEditor(path: string, bytes: any, encoding: string): void{
    if (this.editor1 != undefined) {
      if (this.editor1.exist(path))
        this.editor1.selectTab(path);
      else{
        this.editor1.setContent(path, TextUtil.decode(bytes, encoding))
        this.editor1.selectTab(path);
      }
    }
  }

  nodeCreated(node: GithubTreeNode){ }

  nodeRemoved(node: GithubTreeNode){
    this.editor1.removeContent(node.path);
  }

  nodeMoved(e: {fromPath: string, to: GithubTreeNode}){
    if(e.to.type == 'blob' && this.editor1.exist(e.fromPath)){
      let content = this.editor1.getContent(e.fromPath);
      this.editor1.removeContent(e.fromPath);
      this.editor1.setContent(e.to.path, content);
      if(this.selectedNode == e.to)
        this.nodeSelected(e.to);
    }
  }

  contentChanged(path: string){
    if(path == this.selectedNode.path){
      this.selectedNode.setContentModifiedFlag();
      console.debug(`The content of ${path} is modified.`)
    }
  }

  async initialzeWorkspace(userId, repositoryName, branchName?: string): Promise<void> {
    let details = this.wrapper.repositoryDetails(userId, repositoryName).then((result) => {
      this.repositoryDetails = result;
    }, () => {
      console.error("Repository can't be loaded.")
    });

    let branches = this.wrapper.branches(userId, repositoryName).then((result) => {
      this.branches = result;
    }, () => {
      console.error("Branches can't be loaded.")
    });

    let defaultBranch = Promise.all([details, branches]).then(() => {
      const defaultBranchName = this.repositoryDetails.default_branch;
      if(branchName)
        this.setBranchByName(branchName);
      else
        this.setBranchByName(defaultBranchName);
    }, () => {
      console.error("Default branch can't be loaded.");
    });

    await defaultBranch;

    return this.setTree().then((v) => { },
      () => {
        console.error("Tree can't be loaded.")
      }
    );
  }

  setTree(): Promise<void> {
    const tree = this.wrapper.tree(this.userId, this.repositoryName, this.selectedBranch.commit.sha);
    return tree.then(tree => {
      this.flatTree = tree;
    });
  }

  setBranchByName(branchName: string): void {
    const branch = this.branches.find((v) => {
      if (v.name == branchName) {
        return true;
      } return false;
    });
    this.selectedBranch = branch;
  }

  onBranchChange(event: MatSelectChange){
    this.treeStatus = TreeStatusOnWorkspace.Loading;
    const branch = event.value;
    this.router.navigate([], {queryParams: {branch: branch.name}})
  }

  onStage(){
    this.workspaceStatus = WorkspaceStatus.Stage;
    this.rootToStage = this.tree.getRoot();
    this.stage.invalidate();
  }

  onEdit(){
    this.workspaceStatus = WorkspaceStatus.View;
  }

  onCommit(){
    this.workspaceStatus = WorkspaceStatus.View;
  }
}
