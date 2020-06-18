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
import { FileRenameAction } from '../core/action/user/file-rename-action';
import { SelectAction } from '../core/action/user/select-action';
import { MicroActionComponentMap, SupportedComponents } from '../core/action/micro/micro-action-component-map';
import { GithubTreeSelectMicroAction } from '../core/action/micro/github-tree-select-micro-action';
import { RemoveNodeAction } from '../core/action/user/remove-node-action';
import { CreateAction } from '../core/action/user/create-action';
import { GithubTreeSnapshotMicroAction } from '../core/action/micro/github-tree-snapshot-micro-action';
import { UserActionDispatcher } from '../core/action/user/user-action-dispatcher';
import { TabRenameMicroAction } from '../core/action/micro/tab-rename-micro-action';
import { GithubTreeRenameMicroAction } from '../core/action/micro/github-tree-rename-micro-action';
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
  selectedNode: TreeNode;
  dataSource: GithubTreeNode[];
  searchInputFormControl = new FormControl('');

  subscriptions: Array<Subscription> = [];

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private localUpload: LocalUploadService, private dispatcher: UserActionDispatcher) {
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
                new FileRenameAction(pre, GithubTreeNode.getNameFromPath(pre), node.path, node.name, this, this.dispatcher).start();
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
    this.subscriptions.push(
      this.searchInputFormControl.valueChanges.subscribe((v: string) => {
        this.treeComponent.treeModel.filterNodes(v, false);
      }));
    this.subscriptions.push(
      MicroActionComponentMap.getSubjectByComponent(SupportedComponents.GithubTreeComponent).subscribe((micro) => {
        if (micro instanceof GithubTreeSelectMicroAction) {
          try {
            if(this.get(micro.selectedPath)){
              let path = micro.selectedPath;
              if (this.selectedNode == undefined || path != this.selectedNode.data.path) {
                this.selectNode(micro.selectedPath);
              }
              micro.succeed(() => { });
            }else{
              micro.fail(new Error(`${micro.selectedPath} is not found.`));
            }
          } catch{
            micro.fail();
          }
        }else if(micro instanceof GithubTreeSnapshotMicroAction){
          const treeArr = this.root.reduce((acc, node, tree) => {
            if (node.path != "")
              acc.push(node.toGithubNode());
            return acc;
          }, [] as Array<GithubNode>, false);
          micro.succeed(() => {}, treeArr);
        }else if(micro instanceof GithubTreeRenameMicroAction){
          try{
            if(micro.parent.origin == this){
              micro.succeed(() => {});
            }else{
              this.renameNode(micro.oldPath, micro.newName);
              micro.succeed(() => {});
            }
          } catch {
            micro.fail();
          }
        }
      })
    )
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.tree != undefined && changes.tree.currentValue != undefined) {
      console.debug("tree is changed")
      this.dataSource = this.tree.children;
      this.root = this.tree;
      this.refreshTree();
    }
  }

  /**
   * return null if the node does not exist
   * @param path 
   */
  private selectNode(path: string): GithubTreeNode{
    let node: TreeNode = this.treeComponent.treeModel.getNodeBy((e: TreeNode) => e.data.path == path)
    if(node != null){
      node.setIsActive(true);
      this.onSelectNode(node);
      return node.data;
    }else{
      console.warn(`${path} was not found`);
      return null;
    }
  }

  onSelectNode(node: TreeNode) {
    if(this.renamingNode != node){
      this.selectedNode = node;
      if(node.data.type == 'blob'){
        if(!this.dispatcher.isRunning){
          new SelectAction(node.data.path, this, this.dispatcher).start();
        }
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
        new CreateAction(node.path, this, this.dispatcher).start();
      else{
        let action = new FileRenameAction(pre, GithubTreeNode.getNameFromPath(pre), node.path, node.name, this, this.dispatcher)
        action.start();
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
    this.selectedNode = undefined;
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
      new RemoveNodeAction(node.path, this, this.dispatcher).start();
    });
    this.refreshTree();
  }

  refreshTree() {
    this.treeComponent.treeModel.update();
    // this.searchInputFormControl.setValue('');
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
      const treeNode: TreeNode = this.treeComponent.treeModel.getNodeBy((p) => p.data.path == path);
      return treeNode == null ? undefined : treeNode.data
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
