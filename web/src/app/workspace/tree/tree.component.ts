import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource, MatTreeNestedDataSource } from '@angular/material';
import { TreeNode } from '@angular/router/src/utils/tree';
import { GithubTreeNode } from './github-tree-node';
import { FlatNode } from './flat-node';
import { GithubTreeToTree } from './github-tree-to-tree';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnChanges {
  @Input("repository") repository;
  @Input("tree") tree: any;
  @Output("nodeSelected") nodeSelected = new EventEmitter<GithubTreeNode>();

  selectedNode: GithubTreeNode;

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

  ngOnChanges(){
    if(this.tree != undefined){
      const nodeTransformer = new GithubTreeToTree(this.tree.tree);
      const hiarachyTree = nodeTransformer.getTree();
      this.dataSource.data = hiarachyTree;
      console.log(`A tree is loaded with ${this.tree.tree.length} nodes.`)
    }
  }

  selectNode(node: GithubTreeNode){
    this.nodeSelected.emit(node);
    this.selectedNode = node;
  }

  hasChild = (_: number, node: GithubTreeNode) => !!node.children && node.children.length > 0;
}
