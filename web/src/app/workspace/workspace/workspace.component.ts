import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, AfterContentInit, ElementRef, OnChanges, SimpleChanges, HostListener, Inject } from '@angular/core';
import { WrapperService } from 'src/app/github/wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject, Observable, combineLatest, fromEventPattern } from 'rxjs';
import { MatDrawer, MatSelectChange, MatTabGroup } from '@angular/material';
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
import { repositoryDetails } from 'src/app/testing/mock-data';
import { CommitProgressComponent } from './commit-progress/commit-progress.component';
import { group } from '@angular/animations';
import { TabComponent } from './tab/tab.component';
import { Tab } from './tab/tab';
import { Serializable } from './serializable';
import { Pack } from './pack';
import { WorkspacePack } from './workspace-pack';
import { Database, DatabaseToken } from 'src/app/db/database';
import { WorkspaceService, WorkspaceCommand } from './workspace.service';

declare const monaco;

export enum TreeStatusOnWorkspace{
  Loading, Committing, NotInitialized, Done, Fail, TreeEmpty
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
  styleUrls: ['./workspace.component.css'],
  providers: [WorkspaceService]
})
export class WorkspaceComponent implements OnInit, OnDestroy, AfterContentInit, Serializable {
  FileType = FileType;
  TreeStatus = TreeStatusOnWorkspace;
  ContentStatus = ContentStatusOnWorkspace;
  WorkspaceStatus = WorkspaceStatus;
  constructor(private wrapper: WrapperService, private monacoService: MonacoService, private route: ActivatedRoute
    , private router: Router, private sanitizer: DomSanitizer, @Inject(DatabaseToken) private database: Database
    , private workspaceService: WorkspaceService) { 
  }

  @ViewChild("tree") tree: GithubTreeComponent;
  @ViewChild("editor1") editor1: Editor;
  @ViewChild("stage") stage: Stage;
  @ViewChild("action") action: ActionComponent;
  @ViewChild(CommitProgressComponent) commitProgress: CommitProgressComponent;
  @ViewChild(TabComponent) tab: Tab;
  

  userId;
  repositoryName;
  repositoryDetails;
  branches: Array<any>;
  selectedBranch;
  root: GithubTreeNode;
  nodesToStage: GithubTreeNode[];

  selectedNodePath: string;
  encoding = 'utf-8'
  encodingMap: Map<string, string> = new Map<string, string>();
  selectedFileType: FileType;
  selectedImagePath: SafeResourceUrl;
  selectedRawPath: SafeResourceUrl;
  placeholderForCommit: string = `It's committed at ${window.location}`

  dirtyCount: number = 0;
  contentStatus: ContentStatusOnWorkspace = ContentStatusOnWorkspace.NotInitialized;
  treeStatus: TreeStatusOnWorkspace = TreeStatusOnWorkspace.NotInitialized;
  workspaceStatus: WorkspaceStatus = WorkspaceStatus.View;

  refreshSubject = new Subject<void>()
  subscriptions: Array<Subscription> = []

  @ViewChild("leftDrawer") leftPane: MatDrawer;
  @ViewChild("rightDrawer") rightPane: MatDrawer;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.toggle();  
  }

  ngOnInit() {
    this.initalizeLoader();
    let s = combineLatest(this.route.paramMap, this.route.queryParamMap, this.refreshSubject).subscribe(([p, q]) => {
      let promise;
      if (p.has('userId') && p.has('repositoryName')) {
        const userId = p.get('userId');
        const repositoryName = p.get('repositoryName');
        const branchName = this.route.snapshot.queryParams['branch'] ? this.route.snapshot.queryParams['branch'] : (this.selectedBranch ? this.selectedBranch.name : undefined);
        promise = this.initialize(userId, repositoryName, branchName);
      } else {
        this.treeStatus = TreeStatusOnWorkspace.Fail;
        promise = new Promise((r, reject) => {
          reject('It does not have user id or repository name');
        });
      }
    });
    this.workspaceService.commandChannel.subscribe((command) => {
      if(command instanceof WorkspaceCommand.SelectTab){
        if(command.source != this && this.selectedNodePath != command.path){
          this.nodeSelected(command.path);
        }
      }else if(command instanceof WorkspaceCommand.SelectNodeInTree){
        if(command.source != this && this.selectedNodePath != command.node.path){
          this.nodeSelected(command.node);
        }
      }else if(command instanceof WorkspaceCommand.RemoveNodeInTree){
        
      }else if(command instanceof WorkspaceCommand.CloseTab){
        
      }else{
        console.warn(`It can't handle ${typeof command}.`)
      }
    });

    this.refreshSubject.next();
    this.subscriptions.push(s);
  }

  initialize(userId, repositoryName, branchName): Promise<void>{
    let selectedNodePath = this.selectedNodePath;
    if((this.selectedBranch != undefined) && (branchName != this.selectedBranch.name)){
      this.resetTab();
    }
    this.resetEditor();
    this.selectedImagePath = undefined;
    this.selectedFileType = undefined;
    this.action.select(ActionState.Edit);
    this.treeStatus = TreeStatusOnWorkspace.Loading;

    let promise = this.initialzeWorkspace(userId, repositoryName, branchName).finally(() => {
      if(this.root == undefined)
        this.treeStatus = TreeStatusOnWorkspace.TreeEmpty;
      else
        this.treeStatus = TreeStatusOnWorkspace.Done;
    }).then(()=>{
      if(selectedNodePath != undefined){
        this.selectNode(selectedNodePath);
        this.invalidateDirtyCount();
      }
      // this.deserialize(this.database.get(this.selectedBranch.commit.sha));
    })
    return promise;
  }

  private invalidateDirtyCount(){
    this.invalidateNodesToStage();
    if(this.nodesToStage == undefined)
      this.dirtyCount = 0;
    else
      this.dirtyCount = this.nodesToStage.length;
  }

  private invalidateNodesToStage(){
    if(this.root != undefined)
      this.nodesToStage = this.root.getBlobNodes().filter(v => (v.state.length > 0) && v.name != undefined && v.name.length != 0 
        && !(v.state.includes(NodeStateAction.Created) && v.state.includes(NodeStateAction.Deleted)));
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

  toggleDiff(){
    if (this.editor1.isDiffOn) {
      this.editor1.selectTab(this.selectedNodePath);
    } else {
      let nodes = this.root.getBlobNodes();
      const filteredNodes = nodes.filter((v) => {
        return v.path == this.selectedNodePath && !v.state.includes(NodeStateAction.Created);
      });
      if (filteredNodes.length == 1) {
        let node = filteredNodes[0];
        let type = TextUtil.getFileType(node.name);
        if (type == FileType.Text) {
          this.getOriginalText(node.sha).then((content: string) => {
            this.editor1.diffWith(this.selectedNodePath, content);
          });
        }
      }else{
        console.warn(`${filteredNodes[0].path} are ${filteredNodes.length}. it's expected to be one`)
      }
    }
  }

  toggleMd(){
    if (this.editor1.isMdOn) {
      this.editor1.selectTab(this.selectedNodePath);
    } else {
      let nodes = this.root.getBlobNodes();
      const filteredNodes = nodes.filter((v) => {
        return v.path == this.selectedNodePath;
      });
      if (filteredNodes.length == 1) {
        this.editor1.md();
      }
    }
  }

  resetTab(){
    if(this.tab != undefined)
      this.tab.clear();
  }

  resetEditor(){
    this.selectedNodePath = '';
    this.contentStatus = ContentStatusOnWorkspace.NotInitialized
  }

  ngAfterContentInit() {
    this.toggle();
    this.rightPane.toggle();
  }

  ngOnDestroy() {
    this.clean();
  }

  private clean(){
    this.subscriptions.forEach(subscribe =>
      subscribe.unsubscribe());
  }

  toggle() {
    this.leftPane.toggle();
    this.editor1.shrinkExpand();
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
    this.userId = userId;
    this.repositoryName = repositoryName;
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

    await Promise.all([details, branches]);

    if (this.branches.length == 0) {
      console.error("It seems that this repository is empty.");
    } else {
      const defaultBranchName = this.repositoryDetails.default_branch;
      if (branchName)
        this.setBranchByName(branchName);
      else
        this.setBranchByName(defaultBranchName);

      return this.setTree().then((v) => { },
        () => {
          console.error("Tree can't be loaded.")
        }
      );
    }
  }

  setTree(): Promise<void> {
    const tree = this.wrapper.tree(this.userId, this.repositoryName, this.selectedBranch.commit.sha);
    return tree.then((tree: {sha: string, tree: Array<any>}) => {
      const nodeTransformer = new GithubTreeToTree(tree);
      const hiarachyTree = nodeTransformer.getTree();
      this.root = hiarachyTree;
      console.log(`A tree is loaded with ${tree.tree.length} nodes.`)
    }, () => {
      this.root = undefined;
    });
  }

  setBranchByName(branchName: string): boolean {
    const branch = this.branches.find((v) => {
      if (v.name == branchName) {
        return true;
      } return false;
    });
    
    this.selectedBranch = branch;
    return branch != undefined ? true : false;
  }

  private selectNode(path: string){
    const snapshot = this.selectedNodePath;
    setTimeout(( ) =>{
      if(snapshot != path)
        this.tree.selectNode(path);
    }, 300);
  }

  nodeSelected(path: string | GithubTreeNode) {
    if(path == undefined){
      this.resetEditor();
    } else {
      const node = (typeof path == 'string') ? this.tree.get(path) : path;
      if (node.type == 'blob') {
        this.selectedNodePath = node.path;
        if (!this.tab.exists(node.path)) {
          this.tab.addTab(node.path);
        }
        this.workspaceService.selectTab(this, node.path);
        this.contentStatus = ContentStatusOnWorkspace.Loading;
        let type = TextUtil.getFileType(node.name);
        this.selectedFileType = type;
        if (node.state.filter((v) => v == NodeStateAction.Created).length == 1) {
          if (this.editor1.exist(node.path)) {
            let base64OrText = this.editor1.getContent(node.path);
            if (type == FileType.Image) {
              let mime = TextUtil.getMime(node.name);
              this.selectedImagePath = this.getImage(base64OrText, mime);
            } else if (type == FileType.Text) {
              let encoding = this.encoding;
              this.encodingMap.set(node.sha, encoding);
              this.setContentAndFocusInEditor(node.path, base64OrText);
            }
          } else {
            console.error(`The blob of ${node.path} must be in monaco editor`);
          }
          this.contentStatus = ContentStatusOnWorkspace.Done;
          this.database.save(this.serialize());
        } else {
          this.wrapper.getBlob(this.userId, this.repositoryName, node.sha).then(
            (blob: Blob) => {
              if (type == FileType.Image)
                this.selectedImagePath = this.getImage(blob.content, TextUtil.getMime(node.syncedNode.path))
              //this.getRawUrl(this.repositoryDetails.full_name, this.selectedBranch.commit.sha, node.syncedNode.path);
              else if (type == FileType.Text) {
                let bytes = TextUtil.base64ToBytes(blob.content);
                let encoding = this.encoding;
                this.encodingMap.set(node.sha, encoding);
                this.setContentAndFocusInEditor(node.path, TextUtil.decode(bytes, encoding));
              }
              this.selectedRawPath = this.getRawUrl(this.repositoryDetails.full_name, this.selectedBranch.commit.sha, node.syncedNode.path);
            }, (reason) => {
              console.debug("An error during getting the blob. Maybe selectedNode is invalid.");
              console.debug(node);
            }
          ).finally(() => {
            this.contentStatus = ContentStatusOnWorkspace.Done;
            this.database.save(this.serialize());
          });
        }
      }
    }
  }

  nodeCreated(path: string){
    this.invalidateDirtyCount();
    this.editor1.setContent(path, '');
    this.database.save(this.serialize());
  }

  nodeRemoved(node: GithubTreeNode){
    this.invalidateDirtyCount();
    this.tab.removeTab(node.path);
    this.editor1.removeContent(node.path);
    this.database.save(this.serialize());
  }

  nodeMoved(e: {fromPath: string, to: GithubTreeNode}){
    this.invalidateDirtyCount();
    let isSelectedNode = this.selectedNodePath == e.fromPath;
    if(e.to.type == 'blob'){
      if (this.tab.exists(e.fromPath)) {
        this.tab.removeTab(e.fromPath);
        this.tab.addTab(e.to.path);
      }
      if (this.editor1.exist(e.fromPath)) {
        let content = this.editor1.getContent(e.fromPath);
        this.editor1.removeContent(e.fromPath);
        this.editor1.setContent(e.to.path, content);
        this.database.save(this.serialize());
      }
    }
  }

  nodeUploaded(event: {node: GithubTreeNode, base64: string}){
    this.invalidateDirtyCount();
    let type = TextUtil.getFileType(event.node.name);
    if(type == FileType.Text){
      let bytes = TextUtil.base64ToBytes(event.base64.toString());
      let encoding = this.encoding;
      this.editor1.setContent(event.node.path, TextUtil.decode(bytes, encoding));
    }else {
      this.editor1.setContent(event.node.path, event.base64);
    }
    this.database.save(this.serialize());
  }

  async nodeContentChanged(path: string){
    if(path == this.selectedNodePath){
      const node = this.tree.get(path);
      if(node != undefined){
        const asyncText = this.getOriginalText(node.sha)
        asyncText.then((originalText) => {
          if(this.editor1.getContent(path) == originalText)
            node.setContentModifiedFlag(false);
          else
            node.setContentModifiedFlag(true);
          this.invalidateDirtyCount();
          this.database.save(this.serialize());
        }, (reason) => console.error(reason));
      }else
        console.error(`The content of ${path} is changed, but it does not exist anywhere`)
    }
  }

  private async getOriginalText(sha: string) {
    if (sha != undefined) {
      return this.wrapper.getBlob(this.userId, this.repositoryName, sha).then((blob: Blob) => {
        let bytes = TextUtil.base64ToBytes(blob.content);
        let encoding = this.encoding;
        const originalText: string = TextUtil.decode(bytes, encoding);
        return originalText;
      }, (reason) => {
        return Promise.reject(reason);
      })
    } else {
      return Promise.resolve('');
    }
  }

  onBranchChange(event: MatSelectChange){
    const branch = event.value;
    this.router.navigate([], {queryParams: {branch: branch.name}})
  }

  onStage(){
    this.workspaceStatus = WorkspaceStatus.Stage;
    this.invalidateDirtyCount()
    this.editor1.readonly = true;
    this.editor1.shrinkExpand();
  }

  onEdit(){
    this.workspaceStatus = WorkspaceStatus.View;
    this.editor1.readonly = false;
    this.editor1.shrinkExpand();
  }

  getBase64(path: string): string{
    if (this.editor1.exist(path)) {
      let type = TextUtil.getFileType(path);
      let base64;
      let base64OrText = this.editor1.getContent(path);
      if (type == FileType.Image || type == FileType.Other) {
        base64 = base64OrText;
      } else {
        base64 = TextUtil.stringToBase64(base64OrText);
      }
      return base64;
    }
  }

  async onCommit(msg: string) {
    try {
      this.treeStatus = TreeStatusOnWorkspace.Committing;
      this.commitProgress.prepare();
      let listToCommit = this.root.getBlobNodes();
      let modifiedNodes = listToCommit.filter(n => (n.state.length > 0) && (!n.state.includes(NodeStateAction.Deleted)));
      let blobsExcludingDeletion = listToCommit.filter(n => !n.state.includes(NodeStateAction.Deleted));
      this.commitProgress.uploadBlobs(modifiedNodes.length);
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

      let blobs = blobsExcludingDeletion;
      if (blobs.filter(b => b.state.length > 0).length == 0) {
        console.debug(`${blobs.map(b => b.path).join(', ')} will be committed`);
        this.commitProgress.createTree();
        let createdTree = await this.wrapper.createTree(this.userId, this.repositoryName, blobs);
        this.commitProgress.commit();
        let createdCommit = await this.wrapper.createCommit(this.userId, this.repositoryName, msg, createdTree.sha, this.selectedBranch.commit.sha);
        this.commitProgress.updateBranch(this.selectedBranch.name);
        let createdBranch = await this.wrapper.updateBranch(this.userId, this.repositoryName, this.selectedBranch.name, createdCommit.sha);
        this.commitProgress.done();
        console.log(`The commit and updating ${createdBranch.ref} have succeeded which is ${createdBranch.object.sha}. Check out all in ${createdBranch.url}`);
      } else {
        console.error("Invalid state of nodes is found because blobs containing more than zero state exist");
      }
    } catch(e){
      console.error(e);
    } finally {
      this.refreshSubject.next();
    }
  }

  serialize(): WorkspacePack{
    // if (this.selectedBranch != undefined) {
    //   let packs;
    //   this.invalidateNodesToStage();
    //   let commit_sha = this.selectedBranch.commit.sha;
    //   packs = this.nodesToStage.map(n => {
    //     let base64 = this.getBase64(n.path);
    //     return Pack.of(commit_sha, n, base64);
    //   });
    //   return WorkspacePack.of(commit_sha, this.selectedBranch.name, packs, this.tab.tabs);
    // }
    return;
  }

  deserialize(pack: WorkspacePack): boolean{
    // if(pack == undefined)
    //   return false;
    // let selectedCommitSha = pack.commit_sha;
    // let branchName = pack.branchName;
    // if((this.selectedBranch != undefined) && (selectedCommitSha == this.selectedBranch.commit.sha)){
    //   pack.packs.forEach(p => {
    //     this.editor1.setContent(p.path, p.base64);
    //   });
      
    //   pack.tabs.forEach(tab => {
    //     this.tab.addTab(tab);
    //   });
    //   return true;
    // }
    return false;
  }
}
