import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { GithubTreeNode, newNode, rootNode } from './github-tree-node';
import { GithubTreeToTree } from './github-tree-to-tree';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ITreeOptions, TreeNode, TreeComponent } from 'angular-tree-component';
import { DomSanitizer } from '@angular/platform-browser';

import { TREE_ACTIONS, IActionMapping } from 'angular-tree-component';
@Component({
  selector: 'app-tree',
  templateUrl: './github-tree.component.html',
  styleUrls: ['./github-tree.component.css']
})
export class GithubTreeComponent implements OnChanges, OnDestroy {
  @ViewChild(TreeComponent)
  treeComponent: TreeComponent;

  @Input("repository") repository;
  @Input("tree") tree: {sha: string, tree: Array<any>};
  @Output("nodeSelected") nodeSelected = new EventEmitter<GithubTreeNode>();
  @Output("nodeCreated") nodeCreated = new EventEmitter<GithubTreeNode>();
  @Output("nodeRemoved") nodeRemoved = new EventEmitter<GithubTreeNode>();
  @Output("nodeMoved") nodeMoved = new EventEmitter<{fromPath: string, to: GithubTreeNode}>();

  @ViewChild('blobRenamingInput') blobRenamingInput: ElementRef;
  @ViewChild('treeRenamingInput') treeRenamingInput: ElementRef;

  root: GithubTreeNode;
  renamingFormControl: FormControl = new FormControl();
  renamingNode: TreeNode;
  selectedNode: TreeNode;
  dataSource: GithubTreeNode[];

  subscriptions: Array<Subscription> = [];

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'outline-note',
      sanitizer.bypassSecurityTrustResourceUrl('assets/outline-note-24px.svg'));
  }

  actionMapping: IActionMapping = {
    mouse: {
      drop: (m, n, event, rest: {from: TreeNode, to: {dropOnNode: boolean, index: number, parent: TreeNode}}) => {
        console.log(`${rest.from.data.name} is dropped`);
        let foundIndex = (rest.to.parent.data as GithubTreeNode).children.findIndex((v) => v.name == rest.from.data.name)
        let newParent = rest.to.parent;
        let nodeToMove = rest.from;
        let invalid = nodeToMove.data.isMyDescendant(newParent.parent == null ? this.root : newParent.data);
        if(invalid){
          console.log(`${rest.from.data.path} can not move to ${newParent.data.path}.`);
        }else if(foundIndex == -1){
          const fromPath = rest.from.data.path;
          (rest.from.data as GithubTreeNode).move(newParent.parent == null ? this.root : newParent.data,
              (node, parent, pre, newPath) => {
                this.nodeMoved.emit({'fromPath': pre, 'to': node});
              });
          TREE_ACTIONS.MOVE_NODE(m, n, event, rest);
        }else{
          console.log(`${rest.from.data.name} already exists in the folder.`)
        }
      }
    }
  }

  options = {
    allowDrag: true,
    allowDrop: (element, { parent, index }) => {
      return (element.parent != parent) && (parent.data.type == 'tree' || parent.parent == null);
    },
    actionMapping: this.actionMapping
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tree != undefined && this.tree != undefined) {
        const nodeTransformer = new GithubTreeToTree(this.tree);
        const hiarachyTree = nodeTransformer.getTree();
        this.dataSource = hiarachyTree.children;
        this.root = hiarachyTree;
        console.log(`A tree is loaded with ${this.tree.tree.length} nodes.`)
    }
  }

  selectNode(node: TreeNode) {
    if(this.renamingNode != node){
      this.selectedNode = node;
      this.nodeSelected.emit(node.data);
    }
  }

  completeRenaming() {
    if (this.renamingNode != undefined) {
      const prePath = this.renamingNode.data.path;
      let alreadyExist = this.findInSiblings(this.renamingNode, (node) => this.renamingFormControl.value == node.data.name);

      if (alreadyExist) {
        console.log(`${this.renamingFormControl.value} already exists among siblings`);
      } else if ((this.renamingFormControl.value == undefined) || (this.renamingFormControl.value.length == 0)) {
        console.log(`File name is empty`);
      } else {
        this.renamingNode.data.rename(this.renamingFormControl.value, (node, parent, pre, newPath) => {
          this.nodeMoved.emit({ 'fromPath': pre, 'to': node });
        });
      }
      if (this.renamingNode.data.name == '') {
        this.remove(this.renamingNode);
        console.log(`It will be removed because it doesn't have a name after renaming`);
      }
    }
    this.renamingNode = undefined;
    this.refreshTree();
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
   * @param parentTreeNode if undefined, newNode is created below root node
   * type is 'tree' or 'blob'
   */
  newNode(type: string, parentTreeNode?: TreeNode) {
    let parent: GithubTreeNode = parentTreeNode == undefined ? this.root : parentTreeNode.data;
    let node;
    if (type == 'blob' || type == 'tree') {
      node = newNode(parent, type);
      this.refreshTree();
      // this.treeControl.expand(parent);
      this.nodeCreated.emit(node);

      let found = this.treeComponent.treeModel.getNodeBy((e:TreeNode) => e.data == node);
      
      if (parentTreeNode != undefined) {
        let parentFound = this.treeComponent.treeModel.getNodeBy((e: TreeNode) => e.data == parent);
        parentFound.expand();
      }
      this.rename(found);
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
      this.nodeRemoved.emit(node);
    });
    this.refreshTree();
  }

  refreshTree() {
    this.treeComponent.treeModel.update();
  }

  hasChild = (_: number, node: GithubTreeNode) => !!node.children && node.type == 'tree' ;

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
