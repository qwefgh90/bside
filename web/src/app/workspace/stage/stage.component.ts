import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { GithubTreeNode, GithubNode, NodeStateAction } from '../tree/github-tree-node';
import { Stage } from './stage';
import { WrapperService } from 'src/app/github/wrapper.service';
import { TreeNode } from 'angular-tree-component';
import { FormControl } from '@angular/forms';
import { WorkspaceService } from '../workspace/workspace.service';
import { labelTable, getLabel } from '../info/info.component';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit, OnChanges, Stage {
  @Input("repository") repository;
  @Input("tree") tree: GithubTreeNode;
  @Input("placeholder") placeholder: string = '';
  @Input("modifiedNodes") modifiedNodes: GithubTreeNode[];
  @Output("commit") clickCommit: EventEmitter<string> = new EventEmitter<string>();
  @Input("branch") branch;
  NodeStateAction = NodeStateAction;
  description = new FormControl('');
  options = {
  };

  constructor(private workspaceService: WorkspaceService, private wrapper: WrapperService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.repository != undefined && this.branch != undefined)
      this.checkoutLastestCommit()
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

  labelTable = labelTable 
  getLabel = getLabel;

  commit(){
    this.checkoutLastestCommit().then(() => {
      if(this.isPossibleCommit){
        this.clickCommit.emit(this.description.value.length == 0 ? this.placeholder : this.description.value);
        this.description.setValue("");
      }
    })
  }
  
  selectNode(node: TreeNode){
    if((node.data.state as NodeStateAction[]).findIndex(v => v == NodeStateAction.Deleted) == -1)
      this.workspaceService.selectNode(this, node.data.path);
  }

  undoAll(){
    this.workspaceService.undoAll(this);
  }
  
  isPossibleCommit: boolean = true;
  erorrDescription: string = "The current commit is not lastest. Please backup your works offline and refresh this page and paste them."

  checkoutLastestCommit(){
    if(this.repository != undefined && this.branch != undefined){
      return this.wrapper.branches(this.repository.owner.login, this.repository.name).then(v => {
        return v.find(b => b.name == this.branch.name);
      }).then(lastestBranch => {
        this.isPossibleCommit = this.branch.commit.sha == lastestBranch.commit.sha;
      })
    }else{
      Promise.reject('the repository is not provided.');
    }
  }
}
