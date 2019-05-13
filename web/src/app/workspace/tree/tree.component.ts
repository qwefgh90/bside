import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource, MatTreeNestedDataSource, MatTree } from '@angular/material';
import { TreeNode } from '@angular/router/src/utils/tree';
import { GithubTreeNode, newNode } from './github-tree-node';
import { FlatNode } from './flat-node';
import { GithubTreeToTree } from './github-tree-to-tree';
import { FormControl } from '@angular/forms';
import { Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnChanges, OnDestroy {
  @Input("repository") repository;
  @Input("tree") tree: any;
  @Output("nodeSelected") nodeSelected = new EventEmitter<GithubTreeNode>();
  @Output("nodeCreated") nodeCreated = new EventEmitter<GithubTreeNode>();

  @ViewChild(MatTree) matTree: MatTree<GithubTreeNode>;
  @ViewChild('blobRenamingInput') blobRenamingInput: ElementRef;
  @ViewChild('treeRenamingInput') treeRenamingInput: ElementRef;

  root: GithubTreeNode;
  renamingFormControl: FormControl = new FormControl();
  renamingNode: GithubTreeNode;
  selectedNode: GithubTreeNode;

  subscriptions: Array<Subscription> = [];

  constructor() {
    let s = this.renamingFormControl.valueChanges.subscribe(v => {
      if (this.renamingNode != undefined) {
        this.renamingNode.setName(v);
      }
    })
    this.subscriptions.push(s);
  }

  private transformer = (node: GithubTreeNode, level: number): FlatNode => {
    return {
      path: node.path,
      mode: node.mode,
      type: node.type,
      sha: node.sha,
      size: node.size,
      url: node.url,
      expandable: !!node.children && node.children.length > 0,
      name: node.path.match(new RegExp('[^/]*$'))[0],
      level: level
    };
  }
  treeControl = new NestedTreeControl<GithubTreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<GithubTreeNode>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tree != undefined && this.tree != undefined) {
      const nodeTransformer = new GithubTreeToTree(this.tree.tree);
      const hiarachyTree = nodeTransformer.getTree();
      this.dataSource.data = hiarachyTree.children;
      this.root = hiarachyTree;
      console.log(`A tree is loaded with ${this.tree.tree.length} nodes.`)
    }
  }

  selectNode(node: GithubTreeNode) {
    this.selectedNode = node;
    this.nodeSelected.emit(node);
  }

  completeRenaming() {
    this.renamingNode = undefined;
    this.refreshTree();
  }

  /**
   * type is 'tree' or 'blob'
   */
  newNode(parent: GithubTreeNode, type: string) {
    let node;
    if (type == 'blob' || type == 'tree') {
      node = newNode(parent, type);
      parent.children.push(node);
      this.refreshTree();
      this.treeControl.expand(parent);
      this.nodeCreated.emit(node);
      this.selectNode(node);
    }
  }

  rename(node: GithubTreeNode) {
    this.selectedNode = undefined;
    this.renamingNode = node;
    this.renamingFormControl.setValue(node.name);
    setTimeout(() => {
      if (node.type == "tree")
        this.treeRenamingInput.nativeElement.focus();
      else if (node.type == "blob")
        this.blobRenamingInput.nativeElement.focus();
    }, 200);
  }

  delete(node: GithubTreeNode){
    node.delete();
    this.refreshTree();
  }

  refreshTree() {
    let _data = this.dataSource.data;
    this.dataSource.data = null;
    this.dataSource.data = _data;
  }

  hasChild = (_: number, node: GithubTreeNode) => !!node.children && node.type == 'tree' ;

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
