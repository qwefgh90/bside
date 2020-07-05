import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { GithubTreeNode, NodeStateAction, GithubNode } from './github-tree-node';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ITreeOptions, TreeNode, TreeComponent, KEYS } from 'angular-tree-component';
import { DomSanitizer } from '@angular/platform-browser';

import { TREE_ACTIONS, IActionMapping } from 'angular-tree-component';
import { Upload } from '../upload/upload';
import { UploadComponent } from '../upload/upload.component';
import { UploadFile } from '../upload/upload-file';
import { LocalUploadService } from '../upload/local-upload.service';
import { GithubTree } from './github-tree';
import { BlobPack } from '../workspace/pack';
import { TextUtil } from '../text/text-util';
import { createFeatureSelector, createSelector, select, Store } from '@ngrx/store';
import { workspaceReducerKey, WorkspaceState } from '../workspace.reducer';
import { nodeSelected, nodeRemoved, renamingNode, nodeCreated, treeLoaded, updateTreeSnapshot } from '../workspace.actions';
@Component({
  selector: 'app-tree',
  templateUrl: './github-tree.component.html',
  styleUrls: ['./github-tree.component.css']
})
export class GithubTreeComponent implements OnChanges, OnDestroy, GithubTree, OnInit {
  @ViewChild("tree1", { static: true })
  treeComponent: TreeComponent;

  @Input("repository") repository;
  @Input("tree") tree: GithubTreeNode;
  @Output("nodeUploaded") nodeUploaded = new EventEmitter<{node: GithubTreeNode, base64: string}>();
  
  @ViewChild('blobRenamingInput') blobRenamingInput: ElementRef;
  @ViewChild('treeRenamingInput') treeRenamingInput: ElementRef;
  @ViewChild(UploadComponent, { static: true }) upload: Upload;

  root: GithubTreeNode;
  renamingFormControl: FormControl = new FormControl();
  renamingNode: TreeNode;
  dataSource: GithubTreeNode[];
  searchInputFormControl = new FormControl('');

  subscriptions: Array<Subscription> = [];
  //UI state
  selectedNode: TreeNode;

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private localUpload: LocalUploadService, private store: Store<{}>) {
    iconRegistry.addSvgIcon(
      'outline-note',
      sanitizer.bypassSecurityTrustResourceUrl('assets/outline-note-24px.svg'));
  }

  actionMapping: IActionMapping = {
    mouse: {
      drop: (m, n, event, rest: {from: TreeNode, to: {dropOnNode: boolean, index: number, parent: TreeNode}}) => {
        console.debug(`${rest.from.data.name} is dropped`);
        let foundIndex = (rest.to.parent.data as GithubTreeNode).children.findIndex((v) => v.name == rest.from.data.name)
        let newParent = rest.to.parent;
        let nodeToMove = rest.from;
        if(foundIndex == -1){
          const githubNode = rest.from.data as GithubTreeNode;
          const oldName = githubNode.name;
          const oldPath = githubNode.path;
          (rest.from.data as GithubTreeNode).move(newParent.parent == null ? this.root : newParent.data,
              (node, parent, pre, newPath) => {         
                this.store.dispatch(renamingNode({oldPath: pre, oldName: GithubTreeNode.getNameFromPath(pre), newPath: node.path, newName: node.name}));
                if(node.path == this.selectedNode.data.path){
                  this.store.dispatch(nodeSelected({node: this.selectedNode.data.toGithubNode()}));
                }
              });
          TREE_ACTIONS.MOVE_NODE(m, n, event, rest);
        }else{
          console.log(`${rest.from.data.name} already exists in the folder.`)
        }
      }
    },
    keys: {
      [KEYS.ENTER]: (tree, node, $event) => {
        if(this.renamingNode == undefined){
          node.expand();
          this.onSelectNode(node);
        }
      },
      [KEYS.DOWN]: (tree, node, $event) => {//Prevent default behavior which is focus(true)
        let nextNode = node.findNextNode(true, true);
        if(nextNode != null){
          nextNode.focus(false);
        }
      },
      [KEYS.UP]: (tree, node, $event) => {//Prevent default behavior which is focus(true)
        let previousNode = node.findPreviousNode(true);
        if(previousNode != null){
          previousNode.focus(false);
        }
      },
      36: (tree, node, $event) => {//HOME
        let nodes = this.visibleNodes();
        if(nodes.length > 0){
          let first = nodes[0];
          first.focus(false);
        }
        
      },
      35: (tree, node, $event) => {//END
        let nodes = this.visibleNodes();
        if(nodes.length > 0){
          let end = nodes[nodes.length - 1];
          end.focus(false);
        }
      },
      33: (tree, node, $event) => {//PAGE UP
        let nodes = this.visibleNodes();
        let focusedNode = this.treeComponent.treeModel.focusedNode as TreeNode;
        let activeNode = this.treeComponent.treeModel.getActiveNode() as TreeNode;
        let top = this.viewport.scrollTop;
        if ((focusedNode != undefined)) {
          let found = this.findNodeWithPosition(top + 10, nodes);
          if (found != focusedNode) {
            if (found != undefined) {
              this.scrollTo(found, nodes);
              found.focus(false);
            }
          } else {
            found = this.findNodeWithPosition(top - this.viewport.clientHeight + 10, nodes);
            this.scrollTo(found, nodes);
            found.focus(false);
          }
        }
      },
      34: (tree, node, $event) => {//PAGE DOWN
        let nodes = this.visibleNodes();
        let focusedNode = this.treeComponent.treeModel.focusedNode as TreeNode;
        let activeNode = this.treeComponent.treeModel.getActiveNode() as TreeNode;
        let bottom = this.viewport.scrollTop + this.viewport.clientHeight;
        if ((focusedNode != undefined)) {
          let found = this.findNodeWithPosition(bottom, nodes);
          if (found != focusedNode) {
            if (found != undefined) {
              this.scrollTo(found, nodes);
              found.focus(false);
            }
          } else {
            found = this.findNodeWithPosition(bottom + this.viewport.clientHeight, nodes);
            this.scrollTo(found, nodes);
            found.focus(false);
          }
        }
      }
    }
  }

  ngrx(){
    let feature = createFeatureSelector(workspaceReducerKey);
    let pathSelector = createSelector(feature, (state: WorkspaceState) => state.selectedPath);
    let nodeSelector = createSelector(feature, (state: WorkspaceState) => state.selectedNode);
    let treeLoadedSelector = createSelector(feature, (state: WorkspaceState) => state.treeLoaded);
    let saveRequestSelector = createSelector(feature, (state: WorkspaceState) => state.latestSnapshot.requestTime);
    let selectedPath$ = this.store.pipe(select(createSelector(pathSelector, treeLoadedSelector, (path, treeLoaded) => ({path, treeLoaded}))));
    let s2 = selectedPath$.subscribe(({path, treeLoaded}) => {
        if(treeLoaded){
          if (!this.selectedNode || path != this.selectedNode.data.path) {
            this.selectNode(path);
          }
        }
    });

    let s0 = this.store.select(saveRequestSelector).subscribe((requestTime) => {
      if(requestTime){
        const treeArr = this.root.reduce((acc, node, tree) => {
          if (node.path != "")
            acc.push(node.toGithubNode());
          return acc;
        }, [] as Array<GithubNode>, false);
        this.store.dispatch(updateTreeSnapshot({snapshot: {nodes: treeArr}}));
      }
    });

    let selectedNode$ = this.store.pipe(select(nodeSelector));
    let s1 = selectedNode$.subscribe(githubNode => {
      if (githubNode) {
        let treeNode = this.getTreeNode(githubNode?.path);
        if (treeNode) {
          this.selectedNode = treeNode;
        }
      }
    });
    this.subscriptions.push(s0, s1, s2);
  }

  onNodeFocus(node: TreeNode){
    this.scrollTo(node);
  }

  private get viewport(){
    return ((this.treeComponent.viewportComponent as any).elementRef).nativeElement as HTMLDivElement;
  }

  private visibleNodes(){
    let all: TreeNode[] = this.treeComponent.treeModel.virtualRoot.children[0].isHidden ? [] : [this.treeComponent.treeModel.virtualRoot.children[0]];
    let currentNode = this.treeComponent.treeModel.virtualRoot.children[0].findNextNode(true, true);
    while(currentNode != null){
      all.push(currentNode);
      currentNode = currentNode.findNextNode(true, true);
    }
    return all;
  }

  private findNodeWithPosition(pos: number, visibleNodes?: TreeNode[]): TreeNode{
    let viewport = this.viewport;
    if(pos < 0 ) pos = 0;
    if(pos > viewport.scrollHeight) pos = viewport.scrollHeight;
    
    let all: TreeNode[] = visibleNodes == undefined ? this.visibleNodes() : visibleNodes;
    let nodeHeight = (viewport.scrollHeight/all.length);
    return all.find((v, idx, arr) => {
      let nodePos = ((viewport.scrollHeight/all.length) * idx);
      if((nodePos <= pos) && (pos <= nodePos + nodeHeight) ){
        return true;
      }else
        return false;
    });
  }

  private scrollTo(node: TreeNode, visibleNodes?: TreeNode[]){
    let viewport = this.viewport;
    let all: TreeNode[] = visibleNodes == undefined ? this.visibleNodes() : visibleNodes;
    const index = all.findIndex((v: TreeNode) => {
      return v.id == node.id
    })

    let nodePos = ((viewport.scrollHeight/all.length) * index);
    let nodeHeight = (viewport.scrollHeight/all.length);
    let top = viewport.scrollTop
    let viewportHeight = viewport.clientHeight;
    if(nodePos <= top){
      viewport.scrollTop = nodePos;
      console.debug(`scroll up ${node.data.path} ${viewport.scrollTop}`);
    }
    else if(nodePos >= (top + viewportHeight - (nodeHeight / 2))){
      viewport.scrollTop = nodePos - viewportHeight + nodeHeight;
      console.debug(`scroll down ${node.data.path} ${viewport.scrollTop}`);
    }
  }

  options = {
    allowDrag: true,
    allowDrop: (element, { parent, index }) => {
      return (element.parent != parent) && (parent.data.type == 'tree' || parent.parent == null);
    },
    actionMapping: this.actionMapping,
    scrollOnActivate: false,
  };

  ngOnInit() {
    this.ngrx();
    this.subscriptions.push(
      this.searchInputFormControl.valueChanges.subscribe((v: string) => {
        this.treeComponent.treeModel.filterNodes(v, false);
      }));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tree != undefined && changes.tree.currentValue != undefined) {
      this.dataSource = this.tree.children;
      this.root = this.tree;
      this.refreshTree();
      setTimeout(() => {
        this.store.dispatch(treeLoaded({}));
      }, 0);
    }
  }

  /**
   * return null if the node does not exist
   * @param path 
   */
  private selectNode(path: string): GithubTreeNode{
    let node: TreeNode = this.treeComponent.treeModel.getNodeBy((e: TreeNode) => e.data.path == path) // TODO when treecomponent is not ready
    if(node != null){
      node.setIsActive(true);
      this.onSelectNode(node);
      return node.data;
    }else{
      this.store.dispatch(nodeSelected({node: undefined}));
      console.warn(`${path} was not found`);
      return null;
    }
  }

  onSelectNode(node: TreeNode) {
    if(this.renamingNode != node){
      if(node.data.type == 'blob'){
        this.store.dispatch(nodeSelected({node: node.data.toGithubNode()}));
      }
    }
  }

  completeRenaming() {
    if (this.renamingNode != undefined) {
      let alreadyExist = this.findInSiblings(this.renamingNode, (node) => this.renamingFormControl.value == node.data.name);
      const fileNameRegex = (/[<>:"\/\\|?*\x00-\x1F]/g);
      let invalid = fileNameRegex.test(this.renamingFormControl.value) //https://github.com/sindresorhus/filename-reserved-regex/blob/master/index.js
      if (alreadyExist) {
        console.log(`${this.renamingFormControl.value} already exists among siblings`);
      } else if ((this.renamingFormControl.value == undefined) || (this.renamingFormControl.value.length == 0)) {
        console.log(`There is nothing to type on form`);
      } else if(invalid) {
        console.log(`${this.renamingFormControl.value} abide by naming pattern`);
      } else {
        const githubNode = this.renamingNode.data as GithubTreeNode;
        this.renameNode(githubNode, this.renamingFormControl.value);
      }
      if (this.renamingNode.data.name == undefined) {
        this.remove(this.renamingNode);
        console.log(`It will be removed because it doesn't have any name`);
      }
      this.renamingNode = undefined;
    }
    this.refreshTree();
  }

  renameNode(oldPathOrNode: string | GithubTreeNode, newName: string){
    let githubNode = oldPathOrNode instanceof GithubTreeNode ? oldPathOrNode : this.get(oldPathOrNode);
    githubNode.rename(newName, (node, parent, pre, newPath) => {
      let stateArr = (githubNode as GithubTreeNode).state;
      if (stateArr.length == 2 && stateArr[0] == NodeStateAction.Created)
        this.store.dispatch(nodeCreated({path: node.path}));
      else{
        this.store.dispatch(renamingNode({oldPath: pre, oldName: GithubTreeNode.getNameFromPath(pre), newPath: node.path, newName: node.name}));
        if(node.path == this.selectedNode.data.path){
          this.store.dispatch(nodeSelected({node: this.selectedNode.data.toGithubNode()}));
        }
      }
    });
  }

  findInSiblings(node: TreeNode, predicate: (n2: TreeNode) => boolean): boolean{
    let found = (node.parent.children.findIndex((child) => {
      if(node.id != child.id){
        return predicate(child);
      }else{
        return false;
      }
    }) != -1);
    return found;
  }

  /**
   * 
   * @param type 
   * @param parentTreeNode 
   * @param name if this parameter is defined, rename this node with it
   */
  newNode(type: 'blob' | 'tree', parentTreeNode?: TreeNode, name?: string): TreeNode {
    if (this.renamingNode == undefined) {
      let parent: GithubTreeNode = (parentTreeNode == undefined) ? this.root : parentTreeNode.data;
      let node: GithubTreeNode = GithubTreeNode.githubTreeNodeFactory.createNewNode(parent, type);
      this.refreshTree();
      let newNode = this.treeComponent.treeModel.getNodeBy((e: TreeNode) => e.data == node);
      if (!parent.isRoot) {
        let parentFound = this.treeComponent.treeModel.getNodeBy((e: TreeNode) => e.data == parent);
        parentFound.expand();
      }
      if (name == undefined) {
        this.rename(newNode);
      } else {
        let alreadyExist = this.findInSiblings(newNode, (node) => name == node.data.name);
        if (alreadyExist) {
          console.log(`${name} already exists among siblings`);
          this.remove(newNode);
          newNode = undefined
        } else
          newNode.data.rename(name);
      }
      return newNode;
    }
  }

  rename(node: TreeNode) {
    this.renamingNode = node;
    this.renamingFormControl.setValue(node.data.name);
    setTimeout(() => {
      if (node.data.type == "tree" && this.treeRenamingInput != undefined)
        this.treeRenamingInput.nativeElement.focus();
      else if (node.data.type == "blob" && this.blobRenamingInput != undefined)
        this.blobRenamingInput.nativeElement.focus();
    }, 200);
  }

  remove(node: TreeNode){
    node.data.remove((node: GithubTreeNode) => {
      console.debug(`${node.path} is removed`);
      this.store.dispatch(nodeRemoved({node: node.toGithubNode()}));
    });
    this.refreshTree();
  }

  refreshTree() {
    this.treeComponent.treeModel.update();
  }

  restore(packs: BlobPack[]){
    
  }

  onFileLoaded(f: UploadFile) {
    const parentNode = this.treeComponent.treeModel.getNodeBy((n: TreeNode) => n.data.path == f.parentPath);
    const newNode = this.newNode('blob', parentNode, f.name);
    if(newNode != undefined){
      newNode.data.setUploadedToLocal();
      (<GithubTreeNode>newNode.data).setSize(TextUtil.base64ToBytes(f.base64.toString()).length);
      this.nodeUploaded.emit({node: newNode.data, base64: f.base64.toString()});
    }
  }

  uploadFile(parentPath: string){
    this.upload.select(parentPath);
  }

  get(path: string): GithubTreeNode | undefined {
    try {
      const n = this.root.find(path);
      return n == null ? undefined : n
    } catch (e) {
      console.warn(e);
      return undefined;
    }
  }

  private getTreeNode(path: string): TreeNode | undefined {
    try {
      const treeNode: TreeNode = this.treeComponent.treeModel.getNodeBy((p) => p.data.path == path);
      return treeNode == null ? undefined : treeNode
    } catch (e) {
      console.warn(e);
      return undefined;
    }
  }

  hasChild = (_: number, node: GithubTreeNode) => !!node.children && node.type == 'tree' ;

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
