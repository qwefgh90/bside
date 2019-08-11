import { Component, OnInit, OnDestroy, ViewChild, AfterContentInit, ElementRef, OnChanges, SimpleChanges, HostListener, Inject } from '@angular/core';
import { WrapperService } from 'src/app/github/wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject, combineLatest, from } from 'rxjs';
import { MatDrawer, MatSelectChange, MatDialog } from '@angular/material';
import { GithubTreeNode, NodeStateAction, GithubNode } from '../tree/github-tree-node';
import { MonacoService } from '../editor/monaco.service';
import { Editor } from '../editor/editor';
import { Blob } from 'src/app/github/type/blob';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileType, TextUtil } from '../text/text-util';
import { Stage } from '../stage/stage';
import { ActionComponent, ActionState } from '../action/action/action.component';
import { GithubTreeToTree } from '../tree/github-tree-to-tree';
import { GithubTreeComponent } from '../tree/github-tree.component';
import { CommitProgressComponent } from './commit-progress/commit-progress.component';
import { TabComponent } from './tab/tab.component';
import { Tab } from './tab/tab';
import { BlobPack } from './pack';
import { WorkspacePack } from './workspace-pack';
import { Database, DatabaseToken } from 'src/app/db/database';
import { WorkspaceService, WorkspaceCommand } from './workspace.service';
import { debounceTime, filter } from 'rxjs/operators';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { DeviceDetectorService } from 'ngx-device-detector';
import { editor } from 'monaco-editor';
import { InfoComponent, DisplayInfo } from '../info/info.component';
import { BuildHistoryComponent } from '../build-history/build-history.component';

declare const monaco;

export enum TreeStatusOnWorkspace{
  Loading, Committing, NotInitialized, Done, Fail, TreeEmpty, BranchChanging
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
  providers: [WorkspaceService],
  animations: [
    trigger('savingChanged', [
      state('in',   style({
        opacity: 1
      })),
      state('out', style({
        opacity: 0
      })),
      transition('out => in', animate('50ms ease-out')),
      transition('in => out', [animate('800ms ease-in')])
    ])
  ]
})
export class WorkspaceComponent implements OnInit, OnDestroy, AfterContentInit {
  FileType = FileType;
  TreeStatus = TreeStatusOnWorkspace;
  ContentStatus = ContentStatusOnWorkspace;
  WorkspaceStatus = WorkspaceStatus;
  constructor(private wrapper: WrapperService, private monacoService: MonacoService, private route: ActivatedRoute
    , private router: Router, private sanitizer: DomSanitizer, @Inject(DatabaseToken) private database: Database
    , private workspaceService: WorkspaceService
    , public detector: DeviceDetectorService
    , public dialog: MatDialog) { 
      this.isMobile = this.detector.isMobile();
  }

  @ViewChild("tree") tree: GithubTreeComponent;
  @ViewChild("editor1") editor1: Editor;
  @ViewChild("editor2") editor2: Editor;
  @ViewChild("stage") stage: Stage;
  @ViewChild("action") action: ActionComponent;
  @ViewChild(CommitProgressComponent) commitProgress: CommitProgressComponent;
  @ViewChild(TabComponent) tab: Tab;

  get editor(): Editor{
    return !this.isMobile ? this.editor1 : this.editor2;
  }

  isMobile = false;
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
  errorDescription: string;
  commitStatePack: WorkspacePack;

  modificationSubject = new Subject<void>();
  subjectWithoutSaveFile = new Subject<string>();
  
  subjectWithSaveFile = new Subject<WorkspacePack>();
  refreshSubject = new Subject<void>()
  subscriptions: Array<Subscription> = []
  leftPaneOpened = false;

  @ViewChild("leftDrawer") leftPane: MatDrawer;
  @ViewChild("rightDrawer") rightPane: MatDrawer;

  // @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
  //   this.toggle();  
  // }
  
  saving = false;
  
  ngOnInit() {
    let monacoLoaderSubject = from(this.initalizeLoader());

    //It saves data when content is modified.
    this.subscriptions.push(this.modificationSubject.subscribe(() => {
      this.workspaceService.save(this);
    }));
    
    this.subscriptions.push(this.workspaceService.commandChannel.subscribe((command) => {
      console.debug(command);
      if (command instanceof WorkspaceCommand.Save && (this.treeStatus == TreeStatusOnWorkspace.Done)) {
        this.saving = true;
        this.database.save(this.pack);
        setTimeout( () => this.saving = false, 1000);
      }else if(command instanceof WorkspaceCommand.UndoAll){
        this.database.delete(this.repositoryDetails.id, this.selectedBranch.commit.sha);
        this.selectedNodePath = undefined;
        this.refreshSubject.next();
      }
    }));
    
    this.subscriptions.push(this.workspaceService.commandChannel.subscribe((command) => {
      console.debug(command); 
      if (command.source != this) {
        if (command instanceof WorkspaceCommand.SelectNode) {
          this.nodeSelected(command.path);
          this.workspaceService.save(this);
          this.editor.shrinkExpand();
        }
        else if (command instanceof WorkspaceCommand.CreateNode) {
          if (this.selectedNodePath != command.node.path) {
            this.nodeCreated(command.node.path);
            this.workspaceService.save(this);
          }
        } else if (command instanceof WorkspaceCommand.RemoveNode) {
          this.nodeRemoved(command.node);
          this.workspaceService.save(this);
        } else if (command instanceof WorkspaceCommand.CloseTab) {
        } else if (command instanceof WorkspaceCommand.MoveNodeInTree) {
          this.nodeMoved(command.fromPath, command.to);
          this.workspaceService.save(this);
        } 
        else if (command instanceof WorkspaceCommand.NotifyContentChange){
          this.nodeContentChanged(command.path);
        }
      }
      this.invalidateDirtyCount();
    }));
    
    /**
     * After loading saved data and all children are loaded, 
     * pass the packs to others components.
    */
    let s1 = combineLatest(this.subjectWithSaveFile, monacoLoaderSubject).subscribe((arr) => {
      let pack = arr[0];
      this.editor.load(pack);
      this.tab.load(pack);
      console.log('workspace have been initialized with saved data.');
    })

    /**
     * After reloading component and all children are loaded, 
     * pass the packs to others components.
    */
    let s2 = combineLatest(this.subjectWithoutSaveFile, monacoLoaderSubject).subscribe((arr) => {
      let path = arr[0];
      this.nodeSelected(path);
      this.workspaceService.selectNode(this, path);
      console.log('workspace have been reloaded.');
    })
    
    /**
     * When parameters of url have some changes, initialize workspace again. 
     */
    let s = combineLatest(this.route.paramMap, this.route.queryParamMap, this.refreshSubject).subscribe(([p, q]) => {
      let promise: Promise<void>;
      if (p.has('userId') && p.has('repositoryName')) {
        const userId = p.get('userId');
        const repositoryName = p.get('repositoryName');
        const branchName = this.route.snapshot.queryParams['branch'] ? this.route.snapshot.queryParams['branch'] : (this.selectedBranch ? this.selectedBranch.name : undefined);
        promise = this.initialize(userId, repositoryName, branchName);
      } else {
        promise = new Promise((r, reject) => {
          reject('It does not have user id or repository name');
        });
      }
      promise.catch((err) => {
        console.error(err);
        this.errorDescription = err;
        this.treeStatus = TreeStatusOnWorkspace.Fail;
      })
    });

    this.refreshSubject.next();
    this.subscriptions.push(s);
    this.subscriptions.push(s1);
    this.subscriptions.push(s2);
  }

  initialize(userId, repositoryName, branchName): Promise<void>{
    this.treeStatus = TreeStatusOnWorkspace.Loading;
    this.resetTab();
    this.resetEditor();
    this.resetWorkspace();
    let promise = this.initialzeWorkspace(userId, repositoryName, branchName).then(() => {
      if(this.root == undefined)
        this.treeStatus = TreeStatusOnWorkspace.TreeEmpty;
      else
        this.treeStatus = TreeStatusOnWorkspace.Done;
    });
    return promise;
  }

  async initialzeWorkspace(userId, repositoryName, branchName?: string): Promise<void> {
    try {
      this.userId = userId;
      this.repositoryName = repositoryName;
      let details = this.wrapper.repositoryDetails(userId, repositoryName).then((result) => {
        this.repositoryDetails = result;
      }, () => Promise.reject("Repository can't be loaded."));

      let branches = this.wrapper.branches(userId, repositoryName).then((result) => {
        this.branches = result;
      }, () => Promise.reject("Branches can't be loaded."));

      await Promise.all([details, branches]);

      if (this.branches.length == 0) {
        return Promise.reject("It seems that this repository is empty.");
      } else {
        const defaultBranchName = this.repositoryDetails.default_branch;
        if (branchName)
          this.setBranchByName(branchName);
        else
          this.setBranchByName(defaultBranchName);

        // if it have already loaded packs, do nothing.
        let loadedPack = await this.database.get(this.repositoryDetails.id, this.selectedBranch.commit.sha)
          .then(v => {
            console.log(`${v.commit_sha} have been loaded completely.`)
            return v;
          })
          .catch(r => {
            console.log(r);
            return undefined;
          }) as WorkspacePack

        let tree;
        let doAfterLoadingTree: () => void;
        if (this.commitStatePack != undefined) {
          tree = Promise.resolve({ tree: this.commitStatePack.treePacks, sha: this.commitStatePack.tree_sha });
          doAfterLoadingTree = () => {
            this.subjectWithSaveFile.next(this.commitStatePack)
            this.commitStatePack = undefined;
          };
          
        } else if (loadedPack != undefined) {
          tree = Promise.resolve({ tree: loadedPack.treePacks, sha: loadedPack.tree_sha });
          doAfterLoadingTree = () => this.subjectWithSaveFile.next(loadedPack);
        } else {
          tree = this.wrapper.tree(this.userId, this.repositoryName, this.selectedBranch.commit.sha);
          doAfterLoadingTree = () => this.subjectWithoutSaveFile.next(this.selectedNodePath);
        }
        return this.initTree(tree).then(() => doAfterLoadingTree(), () => console.error("Tree can't be loaded."));
      }

    } catch (error) {
      return Promise.reject(error);
    }
  }

  async initTree(tree: Promise<{sha: string, tree: Array<any>}>): Promise<void> {
    return tree.then((tree: {sha: string, tree: Array<any>}) => {
      const nodeTransformer = new GithubTreeToTree(tree);
      const hiarachyTree = nodeTransformer.getTree();
      this.root = hiarachyTree;
      console.log(`A tree is loaded with ${tree.tree.length} nodes.`)
    }, () => this.root = undefined);
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

  private initalizeLoader(): Promise<void>{
    let p = new Promise<void>((resolve, reject) => {
      if (!(window as any).require) {
        const loaderScript = document.createElement("script");
        loaderScript.type = "text/javascript";
        loaderScript.src = "vs/loader.js";
        loaderScript.addEventListener("load", () => {
          (window as any).require(["vs/editor/editor.main"], () => {
            this.monacoService.monaco.next(monaco);
            resolve();
          });
        });
        document.body.appendChild(loaderScript);
      }
    });
    return p;
  }

  toggleDiff(){
    if (this.editor.isDiffOn) {
      this.editor.selectTab(this.selectedNodePath);
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
            this.editor.diffWith(this.selectedNodePath, content);
          });
        }
      }else{
        console.warn(`${filteredNodes[0].path} are ${filteredNodes.length}. it's expected to be one`)
      }
    }
  }

  toggleMd(){
    if (this.editor.isMdOn) {
      this.editor.selectTab(this.selectedNodePath);
    } else {
      let nodes = this.root.getBlobNodes();
      const filteredNodes = nodes.filter((v) => {
        return v.path == this.selectedNodePath;
      });
      if (filteredNodes.length == 1) {
        this.editor.md();
      }
    }
  }

  resetTab(){
    if(this.tab != undefined)
      this.tab.clear();

  }
  resetEditor(){
    this.contentStatus = ContentStatusOnWorkspace.NotInitialized
  }

  resetWorkspace(){
    this.selectedImagePath = undefined;
    this.selectedFileType = undefined;
    this.selectedNodePath = undefined;
    this.errorDescription = undefined;
    this.action.select(ActionState.Edit);
  }

  ngAfterContentInit() {
    this.toggle();
  }

  ngOnDestroy() {
    this.clean();
  }

  private clean(){
    this.subscriptions.forEach(subscribe =>
      subscribe.unsubscribe());
  }

  toggle() {
    // this.leftPane.toggle();
    this.leftPaneOpened = !this.leftPaneOpened;
    if(this.leftPaneOpened && this.editor != undefined)
      this.editor.shrinkExpand();
  }
 
  getImage(base64: string, mediaType: string): SafeResourceUrl{
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:${mediaType};base64,${base64}`);
  }

  getRawUrl(fullName: string, commitSha: string, path: string): SafeResourceUrl{
    return `https://raw.githubusercontent.com/${fullName}/${commitSha}/${path}`;
  }

  private setContentAndFocusInEditor(path: string, content: string): void{
    if (this.editor != undefined) {
      if (this.editor.exist(path))
        this.editor.selectTab(path);
      else{
        this.editor.setContent(path, content)
        this.editor.selectTab(path);
      }
    }
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

  nodeSelected(path: string | GithubTreeNode) {
    if(path == undefined){
      this.selectedNodePath = undefined;
      this.resetEditor();
    } else {
      const node = (typeof path == 'string') ? this.tree.get(path) : path;
      if (node.type == 'blob') {
        this.selectedRawPath = undefined;
        this.selectedNodePath = node.path;
        this.contentStatus = ContentStatusOnWorkspace.Loading;
        let type = TextUtil.getFileType(node.name);
        this.selectedFileType = type;
        if (node.state.filter((v) => v == NodeStateAction.Created).length == 1) {
          if (this.editor.exist(node.path)) {
            let base64OrText = this.editor.getContent(node.path);
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
        } else {
          this.wrapper.getBlob(this.userId, this.repositoryName, node.sha).then(
            (blob: Blob) => {
              if (type == FileType.Image)
                this.selectedImagePath = this.getImage(blob.content, TextUtil.getMime(node.syncedNode.path))
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
          });
        }
      }
    }
  }

  nodeCreated(path: string){
    this.editor.setContent(path, '');
  }

  nodeRemoved(node: GithubTreeNode){
    this.editor.removeContent(node.path);
  }

  nodeMoved(fromPath: string, to: GithubTreeNode){
    let isSelectedNode = (this.selectedNodePath != undefined) && (this.selectedNodePath == fromPath);
    if(to.type == 'blob'){
      if (this.editor.exist(fromPath)) {
        let content = this.editor.getContent(fromPath);
        this.editor.removeContent(fromPath);
        this.editor.setContent(to.path, content);
      }
      if(isSelectedNode){
        this.nodeSelected(to.path);
      }
    }
  }

  nodeUploaded(event: {node: GithubTreeNode, base64: string}){
    let type = TextUtil.getFileType(event.node.name);
    if(type == FileType.Text){
      let bytes = TextUtil.base64ToBytes(event.base64.toString());
      let encoding = this.encoding;
      this.editor.setContent(event.node.path, TextUtil.decode(bytes, encoding));
    }else {
      this.editor.setContent(event.node.path, event.base64);
    }
    this.workspaceService.save(this);
  }

  async nodeContentChanged(path: string){
    if(path == this.selectedNodePath){
      const node = this.tree.get(path);
      if(node != undefined){
        const asyncText = this.getOriginalText(node.sha)
        asyncText.then((originalText) => {
          if(this.editor.getContent(path) == originalText)
            node.setContentModifiedFlag(false);
          else
            node.setContentModifiedFlag(true);
          this.invalidateDirtyCount();
        }, (reason) => console.error(reason));
        this.modificationSubject.next();
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
    this.selectedNodePath = undefined;
    this.treeStatus = this.TreeStatus.BranchChanging;
    this.router.navigate([], {queryParams: {branch: branch.name}})
  }

  onStage(){
    this.workspaceStatus = WorkspaceStatus.Stage;
    this.invalidateDirtyCount()
    this.editor.readonly = true;
    this.editor.shrinkExpand();
  }

  onEdit(){
    this.workspaceStatus = WorkspaceStatus.View;
    this.editor.readonly = false;
    this.editor.shrinkExpand();
  }

  getBase64(path: string): string{
    if (this.editor.exist(path)) {
      let type = TextUtil.getFileType(path);
      let base64;
      let base64OrText = this.editor.getContent(path);
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
      this.database.save(this.pack);
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
          if(this.editor.exist(v.path)){
            let base64OrText = this.editor.getContent(v.path);
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
      this.commitStatePack = this.pack;
      this.refreshSubject.next();
    }
  }

  private get pack(): WorkspacePack{
      const repositoryId: number = this.repositoryDetails.id;
      const repositoryName: string = this.repositoryDetails.full_name;
      const commitSha = this.selectedBranch.commit.sha;
      const treeSha = this.root.sha;
      const name = this.selectedBranch.name;
      const tabs = Array.from(this.tab.tabs);
      const packs = Array.from(this.editor.getPathList())
        .map((path) => this.tree.get(path))
        .filter((node) => node != undefined)
        .map((node) => {
          let path = node.path;
          const c = this.editor.getContent(path);
          let base64;
          let type = TextUtil.getFileType(path);
          if (type == FileType.Text)
            base64 = TextUtil.stringToBase64(c);
          else
            base64 = c;
          return BlobPack.of(commitSha, node, base64);
        });
      const treeArr = this.root.reduce((acc, node, tree) => {
        if(node.path != "")
          acc.push(node.toGithubNode());
        return acc;
      }, [] as Array<GithubNode>, false);
      return WorkspacePack.of(repositoryId, repositoryName, commitSha, treeSha, name, packs, treeArr, tabs, this.selectedNodePath);
  }

  showInfo(path: string){
    let node = this.tree.get(path);
    let mime = TextUtil.getMime(node.name);
    let size = node.size;
    if(this.selectedFileType == FileType.Text){
      size = TextUtil.encode(this.editor.getContent()).length;
    }
    const dialogRef = this.dialog.open(InfoComponent, {
      width: '350px',
      data: <DisplayInfo>{name: node.name, path: node.path, size: size, mime: (mime == null ? '' : mime), rawUrl: this.selectedRawPath, states: node.state}
    });    
  }

  onBuildHistory(){
    const dialogRef = this.dialog.open(BuildHistoryComponent, {
      minWidth: this.isMobile ? 'unset' : '35em',
      data: {owner: this.userId, repositoryName: this.repositoryName}
    });    
  }
}
