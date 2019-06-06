import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { GithubTreeNode, GithubNode, NodeStateAction } from '../tree/github-tree-node';
import { Stage } from './stage';
import { WrapperService } from 'src/app/github/wrapper.service';
import { TreeNode } from 'angular-tree-component';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit, OnChanges, Stage {
  @Input("repository") repository;
  @Input("tree") tree: GithubTreeNode;
  @Input("modifiedNodes") modifiedNodes: GithubTreeNode[];
  @Output("commit") clickCommit: EventEmitter<void> = new EventEmitter<void>();
  @Output("nodeSelected") nodeSelected = new EventEmitter<GithubTreeNode>();
  NodeStateAction = NodeStateAction;
  // items: Array<GithubTreeNode> = [];
  options = {
  };

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  getLabels(node: GithubTreeNode) {
    let result = node.state.reduce((p, c, idx, arr) => {
      if (!p.set.has(c)) {
        p.acc.push(c);
        p.set.add(c);
      }
      return p;
    },
      { set: new Set<NodeStateAction>(), acc: new Array<NodeStateAction>() }
    );
    return result.acc.map(s => this.getLabel(s));
  }

  labelTable = {
    "C": {short: "C", name: "Created"},
    "CM": {short: "CM", name: "Modified content"},
    "M": {short: "M", name: "Moved"},
    "NM": {short: "NM", name: "Modified name"},
    "D": {short: "D", name: "Deleted"},
    "T": {short: "T", name: "Changed tree"},
    "U": {short: "U", name: "Uploaded"},
    "E": {short: "E", name: "ETC"},
  };

  getLabel(v: NodeStateAction) {
    if (v == NodeStateAction.Created)
      return this.labelTable["C"];
    else if (v == NodeStateAction.ContentModified)
      return this.labelTable["CM"];
    else if (v == NodeStateAction.Moved)
      return this.labelTable["M"];
    else if (v == NodeStateAction.NameModified)
      return this.labelTable["NM"];
    else if (v == NodeStateAction.Deleted)
      return this.labelTable["D"];
    else if (v == NodeStateAction.NodesChanged)
      return this.labelTable["T"];
    else if (v == NodeStateAction.Uploaded)
      return this.labelTable["U"];
    else 
      return this.labelTable["E"];
  }

  commit(){
    this.clickCommit.emit();
  }
  
  selectNode(node: TreeNode){
    this.nodeSelected.emit(node.data);
  }
}
