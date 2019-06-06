import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, AfterContentInit, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { WrapperService } from 'src/app/github/wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject, Observable, combineLatest, fromEventPattern } from 'rxjs';
import { MatDrawer, MatSelectChange } from '@angular/material';
import { GithubTreeNode, NodeStateAction, GithubNode } from '../tree/github-tree-node';
import { MonacoService } from '../editor/monaco.service';
import { Editor } from '../editor/editor';
import { Blob } from 'src/app/github/type/blob';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileType, TextUtil } from '../text/text-util';
import { Stage } from '../stage/stage';
import { ActionComponent, ActionState } from '../action/action/action.component';
import { GithubTreeToTree } from '../tree/github-tree-to-tree';
import { LocalUploadService } from '../upload/local-upload.service';
import { GithubTreeComponent } from '../tree/github-tree.component';

declare const monaco;

export enum TreeStatusOnWorkspace{
  Loading, Committing, NotInitialized, Done, Fail
}

export enum ContentStatusOnWorkspace{
  Loading, NotInitialized, Done, Fail
}

export enum WorkspaceStatus{
  View, Stage, Committing
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
  }

  @ViewChild("tree") tree: GithubTreeComponent;
  @ViewChild("editor1") editor1: Editor;
  @ViewChild("stage") stage: Stage;
  @ViewChild("action") action: ActionComponent;
  

  userId;
  repositoryName;
  repositoryDetails;
  branches: Array<any>;
  selectedBranch;
  root: GithubTreeNode;
  nodesToStage: GithubTreeNode[];

  selectedNode: GithubTreeNode;
  encoding = 'utf-8'
  encodingMap: Map<string, string> = new Map<string, string>();
  selectedFileType: FileType;
  selectedImagePath: SafeResourceUrl;

  initialized = false;
  isNodeDirty = false;
  contentStatus: ContentStatusOnWorkspace = ContentStatusOnWorkspace.NotInitialized;
  treeStatus: TreeStatusOnWorkspace = TreeStatusOnWorkspace.NotInitialized;
  workspaceStatus: WorkspaceStatus = WorkspaceStatus.View;

  subscriptions: Array<Subscription> = []

  @ViewChild("leftDrawer") leftPane: MatDrawer;
  @ViewChild("rightDrawer") rightPane: MatDrawer;

  ngOnInit() {
    this.intialize();
  }

  private intialize(){
    this.action.select(ActionState.Edit);
    this.isNodeDirty = false;
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

  private setContentAndFocusInEditor(path: string, content: string): void{
    if (this.editor1 != undefined) {
      if (this.editor1.exist(path))
        this.editor1.selectTab(path);
      else{
        this.editor1.setContent(path, content)
        this.editor1.selectTab(path);
      }
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
    return tree.then((tree: {sha: string, tree: Array<any>}) => {
      const nodeTransformer = new GithubTreeToTree(tree);
      const hiarachyTree = nodeTransformer.getTree();
      this.root = hiarachyTree;
      console.log(`A tree is loaded with ${tree.tree.length} nodes.`)
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

  nodeSelected(node: GithubTreeNode) {
    if (node.type == 'blob') {
      this.selectedNode = node;
      this.contentStatus = ContentStatusOnWorkspace.Loading;
      let type = TextUtil.getFileType(this.selectedNode.name);
      this.selectedFileType = type;
      if (this.selectedNode.state.filter((v) => v == NodeStateAction.Created).length == 1) {
        if (this.editor1.exist(node.path)) {
          let base64OrText = this.editor1.getContent(node.path);
          if (type == FileType.Image) {
            let mime = TextUtil.getMime(node.name);
            this.selectedImagePath = this.getImage(base64OrText, mime);
          } else if (type == FileType.Text) {
            let encoding = this.encoding;
            this.encodingMap.set(this.selectedNode.sha, encoding);
            this.setContentAndFocusInEditor(this.selectedNode.path, base64OrText);
          }
        } else {
          console.error(`The blob of ${node.path} must be in monaco editor`);
        }
        this.contentStatus = ContentStatusOnWorkspace.Done;
      } else {
        this.wrapper.getBlob(this.userId, this.repositoryName, this.selectedNode.sha).then(
          (blob: Blob) => {
            if(type == FileType.Image)
              this.selectedImagePath = this.getRawUrl(this.repositoryDetails.full_name, this.selectedBranch.commit.sha, this.selectedNode.syncedNode.path);
            else if (type == FileType.Text) {
              let bytes = TextUtil.base64ToBytes(blob.content);
              let encoding = this.encoding;
              this.encodingMap.set(this.selectedNode.sha, encoding);
              this.setContentAndFocusInEditor(this.selectedNode.path, TextUtil.decode(bytes, encoding));
            }
          }, (reason) => {
            console.debug("An error during getting the blob. Maybe selectedNode is invalid.");
            console.debug(this.selectedNode);
          }
        ).finally(() => {
          this.contentStatus = ContentStatusOnWorkspace.Done;
        });
      }
    }
  }

  nodeCreated(node: GithubTreeNode){

  }

  nodeRemoved(node: GithubTreeNode){
    this.isNodeDirty = true;
    this.editor1.removeContent(node.path);
    this.contentStatus = ContentStatusOnWorkspace.NotInitialized
    this.selectedNode = undefined;
  }

  nodeMoved(e: {fromPath: string, to: GithubTreeNode}){
    this.isNodeDirty = true;
    if(e.to.type == 'blob' && this.editor1.exist(e.fromPath)){
      let content = this.editor1.getContent(e.fromPath);
      this.editor1.removeContent(e.fromPath);
      this.editor1.setContent(e.to.path, content);
      if(this.selectedNode == e.to)
        this.nodeSelected(e.to);
    }else{
      this.editor1.setContent(e.to.path, '');
    }
  }

  nodeUploaded(event: {node: GithubTreeNode, base64: string}){
    this.isNodeDirty = true;
    let type = TextUtil.getFileType(event.node.name);
    if(type == FileType.Text){
      let bytes = TextUtil.base64ToBytes(event.base64.toString());
      let encoding = this.encoding;
      // this.encodingMap.set(event.node.sha, encoding);
      this.editor1.setContent(event.node.path, TextUtil.decode(bytes, encoding));
    }else {
      this.editor1.setContent(event.node.path, event.base64);
    }
  }

  nodeContentChanged(path: string){
    this.isNodeDirty = true;
    if(this.selectedNode != undefined && path == this.selectedNode.path){
      this.selectedNode.setContentModifiedFlag();
    }
  }

  onBranchChange(event: MatSelectChange){
    this.treeStatus = TreeStatusOnWorkspace.Loading;
    const branch = event.value;
    this.router.navigate([], {queryParams: {branch: branch.name}})
  }

  onStage(){
    this.workspaceStatus = WorkspaceStatus.Stage;
    this.nodesToStage = this.root.getBlobNodes().filter(v => (v.state.length > 0) && v.name != undefined && v.name.length != 0);
    this.editor1.readonly = true;
  }

  onEdit(){
    this.workspaceStatus = WorkspaceStatus.View;
    this.editor1.readonly = false;
  }

  async onCommit() {
    try {
      this.treeStatus = TreeStatusOnWorkspace.Committing;
      let listToCommit = this.root.getBlobNodes();
      let modifiedNodes = listToCommit.filter(n => (n.state.length > 0) && (!n.state.includes(NodeStateAction.Deleted)));
      let blobsWithoutDeletion = listToCommit.filter(n => !n.state.includes(NodeStateAction.Deleted));
      let responseArrPromise = modifiedNodes.map((v) => {
        let type = TextUtil.getFileType(v.name);
        let oldSha = v.sha;
        let base64;
        let promise: Promise<{ sha: string, url: string }>;
        if (v.state.includes(NodeStateAction.ContentModified) ||
            v.state.includes(NodeStateAction.Created)){
          if(this.editor1.exist(v.path)){
            let base64OrText = this.editor1.getContent(v.path);
            if(type == FileType.Image || type == FileType.Other){
              promise = this.wrapper.createBlob(this.userId, this.repositoryName, base64OrText);
            }else{
              if (this.encodingMap.has(oldSha))
                base64 = TextUtil.stringToBase64(base64OrText, this.encodingMap.get(oldSha));
              else
                base64 = TextUtil.stringToBase64(base64OrText);
              promise = this.wrapper.createBlob(this.userId, this.repositoryName, base64);
            }
          }else
            promise = new Promise((r, reject) => {
              reject('The blob of ${v.path} was not found. It must be in monaco editor')
            })
        } else {
          promise = new Promise((resolve) => {
            resolve({ sha: v.sha, url: v.url });
          })
        }
        return promise.then((response) => {
          v.setSynced(response.sha, 'blob', '100644');
          return { node: v, response: response }
        });
      });

      await Promise.all(responseArrPromise);

      let blobs = blobsWithoutDeletion;
      if (blobs.filter(b => b.state.length > 0).length == 0) {
        console.debug(`${blobs.map(b => b.path).join(', ')} will be committed`);
        let createdTree = await this.wrapper.createTree(this.userId, this.repositoryName, blobs);
        let createdCommit = await this.wrapper.createCommit(this.userId, this.repositoryName, "This is created from BSide.", createdTree.sha, this.selectedBranch.commit.sha);
        let createdBranch = await this.wrapper.updateBranch(this.userId, this.repositoryName, this.selectedBranch.name, createdCommit.sha);
        console.log(`The commit and updating ${createdBranch.ref} have succeeded which is ${createdBranch.object.sha}. Check out all in ${createdBranch.url}`);
      } else {
        console.error("Invalid state of nodes is found because blobs containing more than zero state exist");
      }
    } catch(e){
      console.error(e);
    } finally {
      this.intialize();
    }
  }
}
