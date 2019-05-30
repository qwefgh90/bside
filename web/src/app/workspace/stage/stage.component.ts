import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GithubTreeNode, GithubNode, NodeStateAction } from '../tree/github-tree-node';
import { GithubTree } from '../tree/github-tree';
import { Stage } from './stage';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit, OnChanges, Stage {
  @Input("repository") repository;
  @Input("tree") tree: GithubTreeNode;
  NodeStateAction = NodeStateAction;
  items: Array<GithubTreeNode> = [];
  options = {
  };

  constructor() { }

  ngOnInit() {
    this.invalidate();
  }

  ngOnChanges() {
    this.invalidate();
  }

  invalidate() {
    if (this.tree != undefined) {
      let arr = this.tree.reduce<Array<GithubTreeNode>>((acc, node, tree) => {
        if (!node.isRoot && (node.state.length > 0)) {
          console.debug(`${node.path} is added`);
          acc.push(node);
        }
        return acc;
      }, []);
      this.items = arr;
    }
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
    return result.acc;
  }

  getLabel(v: NodeStateAction) {
    if (v == NodeStateAction.Created)
      return "C";
    else if (v == NodeStateAction.ContentModified)
      return "CM";
    else if (v == NodeStateAction.Moved)
      return "M";
    else if (v == NodeStateAction.NameModified)
      return "NM";
    else if (v == NodeStateAction.Deleted)
      return "D";
    else if (v == NodeStateAction.NodesChanged)
      return "T";
  }

}
