import { Component, OnInit, OnDestroy, ViewChild, AfterContentInit, Inject, Input } from '@angular/core';
import { WrapperService } from 'src/app/github/wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject, combineLatest, from, ReplaySubject, empty, of, timer, interval, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatDrawer } from '@angular/material/sidenav';
import { GithubTreeNode, NodeStateAction, GithubNode } from '../tree/github-tree-node';
import { MonacoService } from '../editor/monaco.service';
import { Editor } from '../editor/editor';
import { Blob } from 'src/app/github/type/blob';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileType, TextUtil } from '../text/text-util';
import { Stage } from '../stage/stage';
import { ActionComponent, ActionState } from '../action/action.component';
import { GithubTreeToTree } from '../tree/github-tree-to-tree';
import { GithubTreeComponent } from '../tree/github-tree.component';
import { CommitProgressComponent } from './commit-progress/commit-progress.component';
import { TabComponent } from '../tab/tab.component';
import { Tab } from '../tab/tab';
import { BlobPack } from './pack';
import { WorkspacePack } from './workspace-pack';
import { Database, DatabaseToken } from 'src/app/db/database';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { DeviceDetectorService } from 'ngx-device-detector';
import { InfoComponent, DisplayInfo } from '../info/info.component';
import { BuildHistoryComponent } from '../build-history/build-history.component';
import { MicroActionComponentMap, SupportedComponents } from '../core/action/micro/micro-action-component-map';
import { WorkspaceClearMicroAction } from '../core/action/micro/workspace-clear-micro-action';
import { WorkspaceUndoMicroAction as WorkspaceUndoMicroAction } from '../core/action/micro/workspace-undo-micro-action';
import { UserActionDispatcher } from '../core/action/user/user-action-dispatcher';
import { MatCheckbox } from '@angular/material/checkbox';
import { bufferCount, bufferTime, distinctUntilChanged, debounceTime, tap, timestamp, map, filter, switchMap, takeUntil, takeWhile, skipWhile, retry, take } from 'rxjs/operators';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { Store, createFeatureSelector, createSelector, select } from '@ngrx/store';
import { WorkspaceState, workspaceReducerKey } from '../workspace.reducer';
import { selectPath as selectPathWithRouterOrSnapshot, monacoLoaded, workspaceDestoryed, requestToSave, updateWorkspaceSnapshot, createNewGithubTree } from '../workspace.actions';
import { selectQueryParam, selectRouteParam } from 'src/app/app-routing.reducer';
import { DOCUMENT } from '@angular/common';
import { WorkspaceSnapshot } from '../core/action/micro/workspace-snapshot-micro-action';
import { MarkdownEditorComponent } from '../markdown-editor/markdown-editor.component';
import { RepositoryInformation } from '../workspace-initializer/workspace-initializer.component';
import { routerRequestAction } from '@ngrx/router-store';
import { TypeState } from 'typestate';

declare const monaco;

export enum EditorStatusOnWorkspace{
  Editor,
  Diff,
  Md
}

export enum TreeStatusOnWorkspace {
  Loading, Committing, NotInitialized, Done, Fail, TreeEmpty, BranchChanging
}

export enum ContentStatusOnWorkspace {
  Loading, NotInitialized, Done, Fail
}

export enum WorkspaceStatus {
  View, Stage
}

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
  providers: [],
  animations: [
    trigger('savingChanged', [
      state('in', style({
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
  @Input() parameter: RepositoryInformation;
  FileType = FileType;
  TreeStatus = TreeStatusOnWorkspace;
  editorType = EditorStatusOnWorkspace;
  ContentStatus = ContentStatusOnWorkspace;
  WorkspaceStatus = WorkspaceStatus;
  constructor(private wrapper: WrapperService, private monacoService: MonacoService, private route: ActivatedRoute
    , private router: Router, private sanitizer: DomSanitizer, @Inject(DatabaseToken) private database: Database
    , public detector: DeviceDetectorService
    , public dialog: MatDialog, private store: Store<{}>,
    @Inject(DOCUMENT) private document: Document) {
    this.isDesktop = this.detector.isDesktop();
  }

  @ViewChild("tree", { static: true }) tree: GithubTreeComponent;
  @ViewChild("editor1") editor1: Editor;
  @ViewChild("editor2") editor2: Editor;
  @ViewChild("preview") preview: MarkdownEditorComponent;
  @ViewChild("stage", { static: true }) stage: Stage;
  @ViewChild("action", { static: true }) action: ActionComponent;
  @ViewChild(CommitProgressComponent, { static: true }) commitProgress: CommitProgressComponent;
  @ViewChild(TabComponent, { static: true }) tab: Tab;
  @ViewChild("autoSaveRef", { static: true }) autoSaveRef: MatCheckbox;

  get editor(): Editor {
    return this.isDesktop ? this.editor1 : this.editor2;
  }
  getFileName = TextUtil.getFileName;

  editorStatusFsm = new TypeState.FiniteStateMachine<EditorStatusOnWorkspace>(EditorStatusOnWorkspace.Editor);
  isDesktop = false;
  //these variables synchronized with router
  //these variables sent to child components
  userId;
  repositoryName;
  repositoryDetails;
  branches: Array<any>;
  selectedBranch;
  selectedCommit;
  root: GithubTreeNode;
  nodesToStage: GithubTreeNode[];

  //const
  defaultEncoding = 'utf-8';
  placeholderForCommit: string = `it's from ${window.location}`;
  //local state
  saveActionSubject: Subject<any> = new Subject();
  selectedNodePath: string;
  contentStatus: ContentStatusOnWorkspace = ContentStatusOnWorkspace.NotInitialized;
  treeStatus: TreeStatusOnWorkspace = TreeStatusOnWorkspace.NotInitialized;
  workspaceStatus: WorkspaceStatus = WorkspaceStatus.View;
  selectedFileType: FileType;
  encodingMap: Map<string, string> = new Map<string, string>();
  selectedImagePath: SafeResourceUrl;
  selectedRawPath: SafeResourceUrl;
  errorDescription: string;

  dirtyCount: number = 0;

  subjectWithoutSaveFile = new Subject<string>();

  subjectWithSaveFile = new Subject<WorkspacePack>();
  subscriptions: Array<Subscription> = []
  leftPaneOpened = false;

  @ViewChild("leftDrawer") leftPane: MatDrawer;
  @ViewChild("rightDrawer") rightPane: MatDrawer;

  isBeingChanged = false;
  saving = false;

  fsm(){
    this.editorStatusFsm.fromAny(EditorStatusOnWorkspace).toAny(EditorStatusOnWorkspace);
    this.editorStatusFsm.on(EditorStatusOnWorkspace.Diff, (from) => {
      let nodes = this.root.getBlobNodes();
      const filteredNodes = nodes.filter((v) => {
        return v.path == this.selectedNodePath && !v.state.includes(NodeStateAction.Created);
      });
      if (filteredNodes.length == 1) {
        let node = filteredNodes[0];
        let type = TextUtil.getFileType(node.name);
        if (type == FileType.Text) {
          this.getOriginalText(node.sha).then((content: string) => {
            setTimeout(() => this.editor.diffWith(this.selectedNodePath, content), 0);
          });
        }
      } else {
        console.warn(`${filteredNodes[0].path} are ${filteredNodes.length}. it's expected to be one`)
      }
    });
    this.editorStatusFsm.on(EditorStatusOnWorkspace.Editor, (from) => {
      if(from != EditorStatusOnWorkspace.Editor){
        this.preview.setContent("preview", "");
        this.preview.select('preview');
        this.editor.select(this.selectedNodePath);
      }
    });
    
    this.editorStatusFsm.on(EditorStatusOnWorkspace.Md, (from) => {
      this.preview.setContent("preview", this.editor.getContent());
      this.preview.select('preview');
      setTimeout(() => this.preview.md(true), 0);
    });
  }

  ngrx(){
    let feature = createFeatureSelector(workspaceReducerKey);
    let selectedPathSelector = createSelector(feature, (state: WorkspaceState) => state.selectedPath);
    let nodeSelector = createSelector(feature, (state: WorkspaceState) => state.selectedNode);
    let editorSelector = createSelector(feature, (state: WorkspaceState) => state.editorLoaded);
    let renamedPathSelector = createSelector(feature, (state: WorkspaceState) => state.latestRenamingPath);
    let createdNodeSelector = createSelector(feature, (state: WorkspaceState) => state.latestCreatedPath);
    let pathToUndoSelector = createSelector(feature, (state: WorkspaceState) => state.latestPathToUndo);
    let saveRequestSelector = createSelector(feature, (state: WorkspaceState) => state.latestSnapshot.requestTime);
    let latestSnapshotSelector = createSelector(feature, (state: WorkspaceState) => state.latestSnapshot);
    let removedPathSelector = createSelector(feature, (state: WorkspaceState) => state.latestRemovedPath);
    let latestResetTimeSelector = createSelector(feature, (state: WorkspaceState) => state.latestResetTime);
    let latestPathForChangesInContentSelector = createSelector(feature, (state: WorkspaceState) => state.latestPathForChangesInContent);
    
    let selectedNode$ = this.store.pipe(select(createSelector(nodeSelector, editorSelector, (node, loaded) => ({node, loaded}))));
    let s0 = selectedNode$.subscribe(({node, loaded}) => {
      if (loaded) {
        let path = node?.path;
        this.fillEditor(path);
        this.dispatchSaveAction(this.autoSaveRef.checked);
        this.editorStatusFsm.go(EditorStatusOnWorkspace.Editor);
      }
    });

    let pathSelector$ = this.store.pipe(select(selectedPathSelector));
    let s1 = pathSelector$.subscribe(path => {
      if(path && path != ''){
        if (this.route.snapshot.queryParams['path'] == path) {
        } else {
          this.router.navigate([], { queryParamsHandling: 'merge', queryParams: { path: path } }); //synchronization with router
        }
      }
    });

    let renamedPath$ = this.store.pipe(select(renamedPathSelector));
    let s2 = renamedPath$.subscribe((renameInfo) => {
      if (renameInfo) {
        let { oldPath, newPath } = renameInfo;
        this.nodeMoved(oldPath, newPath);
        this.invalidateDirtyCount();  
        this.dispatchSaveAction(this.autoSaveRef.checked);
      }
    });

    let removedPath$ = this.store.pipe(select(removedPathSelector));
    let s8 = removedPath$.subscribe((removedPath) => {
      if (removedPath) {
        this.invalidateDirtyCount();
        this.dispatchSaveAction(this.autoSaveRef.checked);
      }
    });

    let latestPathForChanges$ = this.store.pipe(select(latestPathForChangesInContentSelector));
    let s9 = latestPathForChanges$.subscribe(({path, time}) => {
      if (path) {
        this.nodeContentChanged(path);
        this.dispatchSaveAction(this.autoSaveRef.checked);
      }
    });

    let latestResetTime$ = this.store.pipe(select(latestResetTimeSelector));
    let s5 = latestResetTime$.subscribe((date) => {
      if (date) {
        this.database.delete(this.repositoryDetails.id, this.selectedBranch.name, this.selectedBranch.commit.sha);
        this.document.location.reload();
      }
    });

    let createdNode$ = this.store.pipe(select(createdNodeSelector));
    let s3 = createdNode$.subscribe((path) => {
      if (this.selectedNodePath != path) {
        this.nodeCreated(path);
        this.invalidateDirtyCount();
        this.dispatchSaveAction(this.autoSaveRef.checked);
      }
    });

    let pathToUndo$ = this.store.pipe(select(pathToUndoSelector));
    let s10 = pathToUndo$.subscribe((path) => {
      if (path) {
        const node = this.root.find(path);
        if (node != undefined) {
          const asyncText = this.getOriginalText(node.sha)
          asyncText.then(async (text) => {
            this.editor.setContent(path, text);
            await this.nodeContentChanged(path);
            this.dispatchSaveAction(this.autoSaveRef.checked);
          }, () => {
            console.error(`The original content of ${path} couldn't be loaded.`);
          });
        }else{
          console.warn(`${path} couldn't be found.`);
        }
      }
    });

    let queryPathSelector = selectQueryParam('path');

    let tuple = createSelector(editorSelector, (editorLoaded) => ({editorLoaded, userId: this.parameter.userId, 
      repositoryName: this.parameter.repositoryName, branchName: this.parameter.branchName}));
      
    let s4 = this.store.select(tuple).subscribe(({editorLoaded, userId, repositoryName, branchName}) => {
      if (editorLoaded && userId && repositoryName) {
        let promise = this.initialize(userId, repositoryName, branchName);
        promise.then(async() => {
          this.invalidateDirtyCount();
          let loadedPack = await this.database.get(this.repositoryDetails.id, this.selectedBranch.name, this.selectedBranch.commit.sha)
            .then(v => {
              console.log(`${v.commit_sha} have been loaded completely.`)
              return v;
            })
            .catch(r => {
              console.error(r);
              return undefined;
            }) as WorkspacePack;

          let s = this.store.select(queryPathSelector).subscribe((path) => {
            if (path) {
              setTimeout(() => this.store.dispatch(selectPathWithRouterOrSnapshot({ path })), 0);
            } else if (loadedPack?.selectedNodePath) {
              setTimeout(() => this.store.dispatch(selectPathWithRouterOrSnapshot({ path: loadedPack.selectedNodePath })), 0);
            }
          });
          s.unsubscribe();
        }, () => {
          console.error(`An initialization of ${userId}/${repositoryName} failed`);
        });
      }
    });

    let s6 = this.store.select(saveRequestSelector).subscribe((requestTime) => {
      if(requestTime)
        this.store.dispatch(updateWorkspaceSnapshot({snapshot: this.getSnapshot()}));
    });

    let s7 = this.store.select(latestSnapshotSelector).subscribe((snapshotInfo) => {
      if(snapshotInfo?.doneTime){
        let pack = WorkspacePack.of(snapshotInfo.workspaceSnapshot.repositoryId, snapshotInfo.workspaceSnapshot.repositoryName, snapshotInfo.workspaceSnapshot.commitSha, snapshotInfo.workspaceSnapshot.treeSha, snapshotInfo.workspaceSnapshot.name, snapshotInfo.workspaceSnapshot.packs, snapshotInfo.treeSnapshot.nodes, snapshotInfo.tabSnapshot.tabs, snapshotInfo.workspaceSnapshot.selectedNodePath, snapshotInfo.workspaceSnapshot.autoSave);
        this.database.save(pack);
      }
    });
    
    this.subscriptions.push(s0, s1, s2, s3, s4, s6, s7, s8, s9, s10, s5);
  }

  ngOnInit() {
    this.fsm();
    let loadPromise = this.initalizeVSLoader();
    loadPromise.then(() => {
      this.store.dispatch(monacoLoaded({}));
    });
    this.ngrx();

    //It saves data when the content is modified.
    this.subscriptions.push(this.saveActionSubject.pipe(bufferCount(15)).subscribe(() => {
      this.dispatchSaveAction(true);
    }));
    this.subscriptions.push(this.saveActionSubject.pipe(debounceTime(5000)).subscribe(() => {
      this.dispatchSaveAction(true);
    }));
  }

  initialize(userId, repositoryName, branchName): Promise<void> {
    this.treeStatus = TreeStatusOnWorkspace.Loading;
    // this.contentStatus = ContentStatusOnWorkspace.NotInitialized;
    // this.resetTab();
    // this.resetEditor();
    // this.resetWorkspace();
    let promise = this.initializeWorkspace(userId, repositoryName, branchName).then(() => {
      console.log('Your workspace have been initialized with latest saved data.');
      if (this.root == undefined)
        this.treeStatus = TreeStatusOnWorkspace.TreeEmpty;
      else
        this.treeStatus = TreeStatusOnWorkspace.Done;
    }, (reason) => {
      this.treeStatus = TreeStatusOnWorkspace.Fail;
      return Promise.reject(reason);
    });
    return promise;
  }

  async initializeWorkspace(userId, repositoryName, branchName: string): Promise<void> {
    try {
      this.userId = userId;
      this.repositoryName = repositoryName;
      await this.wrapper.repositoryDetails(userId, repositoryName).then((result) => {
        this.repositoryDetails = result;
      }, () => Promise.reject("Repository can't be loaded."));

      await this.wrapper.branches(userId, repositoryName).then((result) => {
        this.branches = result;
      }, () => Promise.reject("Branches can't be loaded."));

      if (this.branches.length == 0) {
        return Promise.reject("It seems that this repository is empty.");
      } else {
        const defaultBranchName = this.repositoryDetails.default_branch;
        if (branchName)
          this.setBranchByName(branchName);
        else
          this.setBranchByName(defaultBranchName);

        // if it has already loaded packs, do nothing.
        let loadedPack = await this.database.get(this.repositoryDetails.id, this.selectedBranch.name, this.selectedBranch.commit.sha)
          .then(v => {
            console.log(`${v.commit_sha} have been loaded completely.`)
            return v;
          })
          .catch(r => {
            console.log(r);
            return undefined;
          }) as WorkspacePack
        
        if(loadedPack){
          await this.initializeTree(Promise.resolve({ tree: loadedPack.treePacks, sha: loadedPack.tree_sha }));
          this.autoSaveRef.checked = loadedPack.autoSave;
          await this.editor.load(loadedPack);
          await this.tab.load(loadedPack);
        }else{
          await this.initializeTree(this.wrapper.tree(this.userId, this.repositoryName, this.selectedBranch.commit.sha));
          await this.editor.load(undefined);
          await this.tab.load(undefined);
        }
        return Promise.resolve();
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async initializeTree(tree: Promise<{ sha: string, tree: Array<any> }>): Promise<void> {
    return tree.then((tree: { sha: string, tree: Array<any> }) => {
      const nodeTransformer = new GithubTreeToTree(tree);
      const hiarachyTree = nodeTransformer.getTree();
      this.root = hiarachyTree;
      this.store.dispatch(createNewGithubTree({}));
      console.log(`A tree is loaded with ${tree.tree.length} nodes.`)
    }, () => this.root = undefined);
  }

  async get(url: string) {
    return this.wrapper.getResponse(url).then((v) => v.body);
  }

  private invalidateDirtyCount() {
    this.invalidateNodesToStage();
    if (this.nodesToStage == undefined)
      this.dirtyCount = 0;
    else
      this.dirtyCount = this.nodesToStage.length;
  }

  private invalidateNodesToStage() {
    if (this.root != undefined)
      this.nodesToStage = this.root.getBlobNodes(true).filter(v => (v.state.length > 0) && v.name != undefined && v.name.length != 0
        && !(v.state.includes(NodeStateAction.Created) && v.state.includes(NodeStateAction.Deleted)));
  }

  private initalizeVSLoader(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!(window as any).require && this.isDesktop) {
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
      } else {
        resolve();
      }
    });
  }

  toggleDiff() {
    if(!(this.editorStatusFsm.currentState == EditorStatusOnWorkspace.Diff))
      this.editorStatusFsm.go(EditorStatusOnWorkspace.Diff);
    else
      this.editorStatusFsm.go(EditorStatusOnWorkspace.Editor);
  }

  togglePreview(){
    if(!(this.editorStatusFsm.currentState == EditorStatusOnWorkspace.Md))
      this.editorStatusFsm.go(EditorStatusOnWorkspace.Md);
    else
      this.editorStatusFsm.go(EditorStatusOnWorkspace.Editor);
  }

  // resetTab() {
  //   if (this.tab)
  //     this.tab.clear();

  // }
  // resetEditor() {
  //   if (this.editor)
  //     this.editor.clear();
  // }

  // resetWorkspace() {
  //   this.selectedImagePath = undefined;
  //   this.selectedFileType = undefined;
  //   this.selectedNodePath = undefined;
  //   this.errorDescription = undefined;
  //   this.action.select(ActionState.Edit);
  // }

  ngAfterContentInit() {
    let ripples = this.autoSaveRef._elementRef.nativeElement.getElementsByClassName('mat-ripple')
    if (ripples.length > 0)
      ripples[0].remove();
    this.autoSaveRef.checked = false;
    this.toggleSidenav();
  }

  ngOnDestroy() {
    this.clean();
  }

  private clean() {
    this.subscriptions.forEach(subscribe => subscribe.unsubscribe());
    this.store.dispatch(workspaceDestoryed({}));
  }

  toggleSidenav() {
    this.leftPaneOpened = !this.leftPaneOpened;
    if (this.leftPaneOpened && this.editor != undefined)
      this.editor.shrinkExpand();
  }

  getImage(base64: string, mediaType: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:${mediaType};base64,${base64}`);
  }

  getRawUrl(fullName: string, commitSha: string, path: string): SafeResourceUrl {
    return `https://raw.githubusercontent.com/${fullName}/${commitSha}/${path}`;
  }

  setBranchByName(branchName: string): boolean {
    const branch = this.branches.find((v) => {
      if (v.name == branchName) {
        return true;
      } return false;
    });

    this.selectedBranch = branch;
    this.get(branch.commit.url).then(v => {
      this.selectedCommit = v;
    })
    return branch != undefined ? true : false;
  }

  fillEditor(pathOrNode: string | GithubTreeNode | undefined) {
    if (!pathOrNode) {
      this.selectedNodePath = undefined;
      this.contentStatus = ContentStatusOnWorkspace.NotInitialized
    } else {
      const node = (typeof pathOrNode == 'string') ? this.root?.find(pathOrNode) : pathOrNode;
      if (node && node.type == 'blob') {
        this.selectedRawPath = undefined;
        this.selectedNodePath = node.path;
        this.contentStatus = ContentStatusOnWorkspace.Loading;
        let fileType = TextUtil.getFileType(node.name);
        this.selectedFileType = fileType;
        if (this.editor.exist(node.path)) {
          let base64OrText = this.editor.getContent(node.path);
          if (fileType == FileType.Image) {
            let mime = TextUtil.getMime(node.name);
            this.selectedImagePath = this.getImage(base64OrText, mime);
          } else if (fileType == FileType.Text) {
            let encoding = this.defaultEncoding;
            this.encodingMap.set(node.sha, encoding);
            this.editor.select(node.path);
          }
          this.contentStatus = ContentStatusOnWorkspace.Done;
        } else {
          this.wrapper.getBlob(this.userId, this.repositoryName, node.sha).then(
            (blob: Blob) => {
              if (fileType == FileType.Image)
                this.selectedImagePath = this.getImage(blob.content, TextUtil.getMime(node.syncedNode.path))
              else if (fileType == FileType.Text) {
                let bytes = TextUtil.base64ToBytes(blob.content);
                let encoding = this.defaultEncoding;
                this.encodingMap.set(node.sha, encoding);
                if(this.selectedNodePath == node.path){ // other asynchronous changes can happen during getBlob()
                  this.editor.setContent(node.path, TextUtil.decode(bytes, encoding))
                  this.editor.select(node.path);
                }else{
                  this.editor.setContent(node.path, TextUtil.decode(bytes, encoding))
                }
              }
              this.selectedRawPath = this.getRawUrl(this.repositoryDetails.full_name, this.selectedBranch.commit.sha, node.syncedNode.path);
            }, (reason) => {
              console.error(`An error during getting the blob`);
              console.error(node);
            }
          ).finally(() => {
            this.contentStatus = ContentStatusOnWorkspace.Done;
          });
        }
      } else {
        console.warn(`${pathOrNode} is not found in the tree`);
      }
    }
  }

  nodeCreated(path: string) {
    this.editor.setContent(path, '');
  }

  nodeRemoved(path: string) {
    this.editor.removeContent(path);
  }

  nodeMoved(fromPath: string, toPath: string) {
    let target = this.root.find(toPath);
    if (target.type == 'blob') {
      if (this.editor.exist(fromPath)) {
        let content = this.editor.getContent(fromPath);
        this.editor.removeContent(fromPath);
        this.editor.setContent(toPath, content);
      }
    }
  }

  nodeUploaded(event: { node: GithubTreeNode, base64: string }) {
    let type = TextUtil.getFileType(event.node.name);
    if (type == FileType.Text) {
      let bytes = TextUtil.base64ToBytes(event.base64.toString());
      let encoding = this.defaultEncoding;
      this.editor.setContent(event.node.path, TextUtil.decode(bytes, encoding));
    } else {
      this.editor.setContent(event.node.path, event.base64);
    }
  }

  async nodeContentChanged(path: string) {
    const node = this.root.find(path);
    if (node != undefined && node.type == 'blob') {
      const asyncText = this.getOriginalText(node.sha)
      await asyncText.then((originalText) => {
        if (this.editor.getContent(path) == originalText)
          node.setContentModifiedFlag(false);
        else
          node.setContentModifiedFlag(true);
        this.invalidateDirtyCount();
      }, (reason) => console.error(reason));
    } else
      console.error(`The content of ${path} is changed, but it does not exist anywhere`)
  }

  private async getOriginalText(sha: string) {
    if (sha != undefined) {
      return this.wrapper.getBlob(this.userId, this.repositoryName, sha).then((blob: Blob) => {
        let bytes = TextUtil.base64ToBytes(blob.content);
        let encoding = this.defaultEncoding;
        const originalText: string = TextUtil.decode(bytes, encoding);
        return originalText;
      }, (reason) => {
        return Promise.reject(reason);
      })
    } else {
      return Promise.resolve('');
    }
  }

  onBranchChange(event: MatSelectChange) {
    let promise = this.dispatchSaveAction(true);
    if (promise instanceof Promise) {
      try {
        promise.then(() => {
          const branch = event.value;
          this.selectedNodePath = undefined;
          this.treeStatus = this.TreeStatus.BranchChanging;
          this.router.navigate([], { queryParams: { branch: branch.name }});
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  onStage() {
    this.workspaceStatus = WorkspaceStatus.Stage;
    this.invalidateDirtyCount()
    this.editor.readonly = true;
    this.editor.shrinkExpand();
  }

  onEdit() {
    this.workspaceStatus = WorkspaceStatus.View;
    this.editor.readonly = false;
    this.editor.shrinkExpand();
  }

  onSave() {
    this.dispatchSaveAction(true);
  }

  getBase64(path: string): string {
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
    let promise = this.dispatchSaveAction(true);
    if (promise instanceof Promise) {
      try {
        await promise.then(async () => {
          this.treeStatus = TreeStatusOnWorkspace.Committing;
          this.commitProgress.prepare();
          let blobNodes = this.root.getBlobNodes();
          let modifiedNodes = blobNodes.filter(n => (n.state.length > 0));
          this.commitProgress.uploadBlobs(modifiedNodes.length);
          let responseArrPromise = this.sync(modifiedNodes);
          await Promise.all(responseArrPromise);

          let objectsForCreatingTree = blobNodes;
          let compactObjectsForCreatingTree = this.compactByCuttingUnchangedBlobs(objectsForCreatingTree, this.root);

          if (compactObjectsForCreatingTree.filter(b => b.type == 'blob' && b.state.length > 0).length == 0) {
            console.debug(`${objectsForCreatingTree.map(b => b.path).join(', ')} will be committed`);
            console.debug(`${compactObjectsForCreatingTree.map(b => b.path).join(', ')} will be committed(compact)`);
            this.commitProgress.createTree();
            let createdTree = await this.wrapper.createTree(this.userId, this.repositoryName, compactObjectsForCreatingTree);
            this.commitProgress.commit();
            let createdCommit = await this.wrapper.createCommit(this.userId, this.repositoryName, msg, createdTree.sha, this.selectedBranch.commit.sha);
            this.commitProgress.updateBranch(this.selectedBranch.name);
            let createdBranch = await this.wrapper.updateBranch(this.userId, this.repositoryName, this.selectedBranch.name, createdCommit.sha);
            this.commitProgress.done(this.repositoryName, 30, 10);
            console.log(`The commit and updating ${createdBranch.ref} have succeeded which is ${createdBranch.object.sha}. Check out all in ${createdBranch.url}`);
          } else {
            console.error("Invalid state of nodes is found because blobs containing more than zero state exist");
          }
        });
      } catch (e) {
        console.error(e);
      } finally {
        const shaBeforeCommit = this.selectedBranch.commit.sha;
        let resultOfPolling = this.pollBranchCommitChange(shaBeforeCommit, 6);
        resultOfPolling.then((sha) => {
          console.info(`It is successful in getting new commit which is ${sha}`);
          this.treeStatus = TreeStatusOnWorkspace.Done;
          this.document.location.reload();
        }
        ,(err) => {
          console.error(err);
          console.error(`It isn't successful in getting new commit of ${this.selectedBranch.name}`);
          this.treeStatus = TreeStatusOnWorkspace.Done;
        })
      }
    }
  }

  /**
   * 
   * @param branchChecker 
   * @param maxTryCount 
   * @param intervalSencond 
   * @returns branch
   */
  private pollBranchCommitChange(shaBeforeCommit: string, maxTry: number): Promise<string>{
    return this._pollBranchCommitChange(shaBeforeCommit, 0, maxTry);
  }

  private _pollBranchCommitChange(shaBeforeCommit: string, count: number, maxTry: number): Promise<string>{
    let promise = this.wrapper.branch(this.userId, this.repositoryName, this.selectedBranch.name);
    count++;
    return promise.then((branch) => {
       if(shaBeforeCommit != branch?.commit?.sha){
         return branch.commit.sha;
       }else if(count > maxTry){
          throw new Error(`The count is over ${maxTry}`);
       }else
        return this._pollBranchCommitChange(shaBeforeCommit, count, maxTry);
    });
  }

  public compactByCuttingUnchangedBlobs(objectsForCreatingTree: GithubTreeNode[], root: GithubTreeNode) {
    let unchangedTree = root.getAllNodes().filter((v, i) =>
      v.type == 'tree' && (v.state.find((v) => v == NodeStateAction.NodesChanged) == undefined));

    let highestUnchangedTreeSet = new Set<GithubTreeNode>();
    unchangedTree.forEach((v) => {
      highestUnchangedTreeSet.add(v.getUnchangedHighestTree());
    });
    let highestUnchangedTreeList = Array.from(highestUnchangedTreeSet);

    let compactObjectsForCreatingTree = objectsForCreatingTree.filter((v) => {
      let willBeUploadedAsBlob = highestUnchangedTreeList.find((tree) => {
        return tree.path != v.path && v.path.startsWith(tree.path)
      }) == undefined;
      return willBeUploadedAsBlob;
    }).concat(highestUnchangedTreeList);
    return compactObjectsForCreatingTree;
  }

  private sync(modifiedNodes) {
    return modifiedNodes.map((v) => {
      let type = TextUtil.getFileType(v.name);
      let oldSha = v.sha;
      let base64;
      let promise: Promise<{ sha: string, url: string }>;
      if (v.state.includes(NodeStateAction.ContentModified) ||
        v.state.includes(NodeStateAction.Created)) {
        if (this.editor.exist(v.path)) {
          let base64OrText = this.editor.getContent(v.path);
          if (type == FileType.Image || type == FileType.Other) {
            promise = this.wrapper.createBlob(this.userId, this.repositoryName, base64OrText);
          } else {
            if (this.encodingMap.has(oldSha))
              base64 = TextUtil.stringToBase64(base64OrText, this.encodingMap.get(oldSha));
            else
              base64 = TextUtil.stringToBase64(base64OrText);
            promise = this.wrapper.createBlob(this.userId, this.repositoryName, base64);
          }
        } else
          promise = new Promise((r, reject) => {
            reject(`The blob of ${v.path} was not found. It must be in monaco editor`)
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
  }

  private clearCommits() {
    this.database.list(this.repositoryDetails.id).then((arr) => {
      arr.forEach(p => {
        if (this.selectedBranch.name == p.branchName)
          this.database.delete(p.repositoryId, p.branchName, p.commit_sha);
      })
    });
  }

  private getSnapshot(containgTree: boolean = true): WorkspaceSnapshot {
    const autoSave = this.autoSaveRef.checked;
    const repositoryId: number = this.repositoryDetails.id;
    const repositoryName: string = this.repositoryDetails.full_name;
    const commitSha = this.selectedBranch.commit.sha;
    const treeSha = this.root.sha;
    const name = this.selectedBranch.name;
    const packs = Array.from(this.editor.getPathList())
      .map((path) => this.root.find(path))
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
    return {
      repositoryId: repositoryId, repositoryName: repositoryName, commitSha: commitSha,
      treeSha: treeSha, name: name, packs: packs, selectedNodePath: this.selectedNodePath, 
      autoSave: autoSave
    };
  }

  private pack(containgTree: boolean = true): WorkspacePack {
    const autoSave = this.autoSaveRef.checked;
    const repositoryId: number = this.repositoryDetails.id;
    const repositoryName: string = this.repositoryDetails.full_name;
    const commitSha = this.selectedBranch.commit.sha;
    const treeSha = this.root.sha;
    const name = this.selectedBranch.name;
    const tabs = Array.from(this.tab.tabs);
    const packs = Array.from(this.editor.getPathList())
      .map((path) => this.root.find(path))
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
      if (node.path != "")
        acc.push(node.toGithubNode());
      return acc;
    }, [] as Array<GithubNode>, false);
    return WorkspacePack.of(repositoryId, repositoryName, commitSha, treeSha, name, packs, treeArr, tabs, this.selectedNodePath, autoSave);
  }

  private htmlBlobUrl(path: string) {
    return `https://github.com/${this.userId}/${this.repositoryName}/blob/${this.selectedBranch.name}/${path}`
  }

  private dispatchSaveAction(eagerly: boolean): Promise<any> | void {
    if (eagerly) {
      this.isBeingChanged = false;
      this.store.dispatch(requestToSave({}));
      let feature = createFeatureSelector(workspaceReducerKey);
      let done = this.store.select(createSelector(feature, (state:WorkspaceState) => state.latestSnapshot.doneTime));
      return done.pipe(take(1)).toPromise();
    } else {
      this.isBeingChanged = true;
      return this.saveActionSubject.next();
    }
  }

  showInfo(path: string) {
    let node = this.root.find(path);
    let mime = TextUtil.getMime(node.name);
    let size = node.size;
    if (this.selectedFileType == FileType.Text) {
      size = TextUtil.encode(this.editor.getContent()).length;
    }
    const dialogRef = this.dialog.open(InfoComponent, {
      width: '350px',
      data: <DisplayInfo>{ name: node.name, path: node.path, size: size, mime: (mime == null ? '' : mime), rawUrl: this.selectedRawPath, states: node.state, htmlUrl: this.htmlBlobUrl(node.path) }
    });
  }

  onBuildHistory() {
    const dialogRef = this.dialog.open(BuildHistoryComponent, {
      minWidth: !this.isDesktop ? 'unset' : '35em',
      data: { owner: this.userId, repositoryName: this.repositoryName }
    });
  }
}
