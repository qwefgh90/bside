import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { GithubTreeNode } from './github-tree-node';
import { GithubTreeToTree } from './github-tree-to-tree';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ITreeOptions, TreeNode, TreeComponent } from 'angular-tree-component';
import { DomSanitizer } from '@angular/platform-browser';

import { TREE_ACTIONS, IActionMapping } from 'angular-tree-component';
import { GithubTree } from './github-tree';
import { Upload } from '../upload/upload';
import { UploadComponent } from '../upload/upload.component';
import { UploadFile } from '../upload/upload-file';
import { LocalUploadService } from '../upload/local-upload.service';
@Component({
  selector: 'app-tree',
  templateUrl: './github-tree.component.html',
  styleUrls: ['./github-tree.component.css']
})
export class GithubTreeComponent implements OnChanges, OnDestroy, GithubTree {
  @ViewChild("tree1")
  treeComponent: TreeComponent;

  @Input("repository") repository;
  @Input("tree") tree: GithubTreeNode;
  @Output("nodeSelected") nodeSelected = new EventEmitter<GithubTreeNode>();
  @Output("nodeCreated") nodeCreated = new EventEmitter<GithubTreeNode>();
  @Output("nodeRemoved") nodeRemoved = new EventEmitter<GithubTreeNode>();
  @Output("nodeMoved") nodeMoved = new EventEmitter<{fromPath: string, to: GithubTreeNode}>();
  @Output("nodeUploaded") nodeUploaded = new EventEmitter<{node: GithubTreeNode, base64: string}>();
  
  @ViewChild('blobRenamingInput') blobRenamingInput: ElementRef;
  @ViewChild('treeRenamingInput') treeRenamingInput: ElementRef;
  @ViewChild(UploadComponent) upload: Upload;

  root: GithubTreeNode;
  renamingFormControl: FormControl = new FormControl();
  renamingNode: TreeNode;
  selectedNode: TreeNode;
  dataSource: GithubTreeNode[];

  subscriptions: Array<Subscription> = [];

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private localUpload: LocalUploadService) {
    iconRegistry.addSvgIcon(
      'outline-note',
      sanitizer.bypassSecurityTrustResourceUrl('assets/outline-note-24px.svg'));
  }

  getRoot(){
    return this.root;
  }

  actionMapping: IActionMapping = {
    mouse: {
      drop: (m, n, event, rest: {from: TreeNode, to: {dropOnNode: boolean, index: number, parent: TreeNode}}) => {
        console.log(`${rest.from.data.name} is dropped`);
        let foundIndex = (rest.to.parent.data as GithubTreeNode).children.findIndex((v) => v.name == rest.from.data.name)
        let newParent = rest.to.parent;
        let nodeToMove = rest.from;
        // let invalid = nodeToMove.data.isMyDescendant(newParent.parent == null ? this.root : newParent.data);
        // if(invalid){
        //   console.log(`${rest.from.data.path} can not move to ${newParent.data.path}.`);
        // }else 
        if(foundIndex == -1){
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
        this.dataSource = this.tree.children;
        this.root = this.tree;
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
      let alreadyExist = this.findInSiblings(this.renamingNode, (node) => this.renamingFormControl.value == node.data.name);
      const fileNameRegex = (/[<>:"\/\\|?*\x00-\x1F]/g);
      let invalid = fileNameRegex.test(this.renamingFormControl.value) //https://github.com/sindresorhus/filename-reserved-regex/blob/master/index.js
      if (alreadyExist) {
        console.log(`${this.renamingFormControl.value} already exists among siblings`);
      } else if ((this.renamingFormControl.value == undefined) || (this.renamingFormControl.value.length == 0)) {
        console.log(`File name is empty`);
      } else if(invalid) {
        console.log(`${this.renamingFormControl.value} File name is invalid`);
      } else {
        this.renamingNode.data.rename(this.renamingFormControl.value, (node, parent, pre, newPath) => {
          this.nodeMoved.emit({ 'fromPath': pre, 'to': node });
        });
      }
      if (this.renamingNode.data.name == undefined) {
        this.remove(this.renamingNode);
        console.log(`It will be removed because it doesn't have any name`);
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
   * @param type 
   * @param parentTreeNode 
   * @param name if this parameter is defined, rename this node with it
   */
  newNode(type: 'blob' | 'tree', parentTreeNode: TreeNode, name?: string): TreeNode {
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
      }else
        newNode.data.rename(name);
    }
    return newNode;
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

  onFileLoaded(f: UploadFile) {
    const parentNode = this.treeComponent.treeModel.getNodeBy((n: TreeNode) => n.data.path == f.parentPath);
    const newNode = this.newNode('blob', parentNode, f.name);
    if(newNode != undefined){
      newNode.data.setUploadedToLocal();
      this.nodeUploaded.emit({node: newNode.data, base64: f.base64.toString()});
      // this.localUpload.set(newNode.data.path, f);
    }
  }

  uploadFile(parentPath: string){
    this.upload.select(parentPath);
  }

  hasChild = (_: number, node: GithubTreeNode) => !!node.children && node.type == 'tree' ;

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
