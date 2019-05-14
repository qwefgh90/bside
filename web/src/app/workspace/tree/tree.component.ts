import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource, MatTreeNestedDataSource, MatTree } from '@angular/material';
import { GithubTreeNode, newNode } from './github-tree-node';
import { FlatNode } from './flat-node';
import { GithubTreeToTree } from './github-tree-to-tree';
import { FormControl } from '@angular/forms';
import { Subscribable, Subscription } from 'rxjs';
import { ITreeOptions, TreeNode, TreeComponent as AngularTreeComponent } from 'angular-tree-component';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnChanges, OnDestroy {

  
  nodes2 = [
    {
      title: 'root1',
      className: 'root1Class'
    },
    {
      title: 'root2',
      className: 'root2Class',
      children: [
        { title: 'child1', className: 'child1Class' }
      ]
    }
  ];

  options1: ITreeOptions = {
    getChildren: () => new Promise((resolve, reject) => { })
  };

  options0: ITreeOptions = {
    displayField: 'title',
    nodeClass: (node) => `${node.data.title}Class`
  };



  @ViewChild(AngularTreeComponent)
  private treeComponent: AngularTreeComponent;












  @Input("repository") repository;
  @Input("tree") tree: any;
  @Output("nodeSelected") nodeSelected = new EventEmitter<GithubTreeNode>();
  @Output("nodeCreated") nodeCreated = new EventEmitter<GithubTreeNode>();

  @ViewChild(MatTree) matTree: MatTree<GithubTreeNode>;
  @ViewChild('blobRenamingInput') blobRenamingInput: ElementRef;
  @ViewChild('treeRenamingInput') treeRenamingInput: ElementRef;

  root: GithubTreeNode;
  renamingFormControl: FormControl = new FormControl();
  renamingNode: TreeNode;
  selectedNode: TreeNode;

  subscriptions: Array<Subscription> = [];

  constructor() {
    let s = this.renamingFormControl.valueChanges.subscribe(v => {
      if (this.renamingNode != undefined) {
        this.renamingNode.data.setName(v);
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

  selectNode(node: TreeNode) {
    if(this.renamingNode != node){
      this.selectedNode = node;
      this.nodeSelected.emit(node.data);
    }
  }

  completeRenaming() {
    this.renamingNode = undefined;
    this.refreshTree();
  }

  /**
   * type is 'tree' or 'blob'
   */
  newNode(parentTreeNode: TreeNode, type: string) {
    let parent: GithubTreeNode = parentTreeNode.data;
    let node;
    if (type == 'blob' || type == 'tree') {
      node = newNode(parent, type);
      parent.children.push(node);
      this.refreshTree();
      // this.treeControl.expand(parent);
      this.nodeCreated.emit(node);

      let found = this.treeComponent.treeModel.getNodeBy((e:TreeNode) => {
        if(e.data == node){
          return true;
        }else return false;
      });
      this.rename(found);
    }
  }

  rename(node: TreeNode) {
    this.selectedNode = undefined;
    this.renamingNode = node;
    this.renamingFormControl.setValue(node.data.name);
    setTimeout(() => {
      if (node.data.type == "tree")
        this.treeRenamingInput.nativeElement.focus();
      else if (node.data.type == "blob")
        this.blobRenamingInput.nativeElement.focus();
    }, 200);
  }

  delete(node: TreeNode){
    node.data.delete();
    this.refreshTree();
  }

  refreshTree() {
    this.treeComponent.treeModel.update();
    // let _data = this.dataSource.data;
    // this.dataSource.data = null;
    // this.dataSource.data = _data;
  }

  hasChild = (_: number, node: GithubTreeNode) => !!node.children && node.type == 'tree' ;

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
