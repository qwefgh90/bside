import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { GithubTreeNode, GithubNode, NodeStateAction } from '../tree/github-tree-node';
import { Stage } from './stage';
import { WrapperService } from 'src/app/github/wrapper.service';
import { TreeNode } from 'angular-tree-component';
import { FormControl } from '@angular/forms';
import { labelTable, getLabel } from '../info/info.component';
import { SelectAction } from '../core/action/user/select-action';
import { UserActionDispatcher } from '../core/action/user/user-action-dispatcher';
import { Store } from '@ngrx/store';
import { undo, resetWorkspace, nodeSelectedInChangesTree } from '../workspace.actions';

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

  constructor(private dispatcher: UserActionDispatcher, private wrapper: WrapperService, private store: Store) { }

  ngOnInit() {
    console.debug("stage init");
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.repository != undefined && this.branch != undefined)
      this.checkoutLastestCommit()
    if(this.modifiedNodes != undefined){
      let index = this.modifiedNodes.findIndex((v, idx) => (v.state as NodeStateAction[]).findIndex(v => v == NodeStateAction.Deleted) == -1)
      if(index != -1){
        setTimeout(() => {
          this.store.dispatch(nodeSelectedInChangesTree({node: this.modifiedNodes[index].toGithubNode()}));
        }, 0);
      }
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
      this.store.dispatch(nodeSelectedInChangesTree({node: node.data.toGithubNode()}));
      // new SelectAction(node.data.path, this, this.dispatcher).start();
  }

  undoAll(){
    this.store.dispatch(resetWorkspace({}));
    // new ClearAction(this, this.dispatcher).start();
  }

  undo(node:GithubTreeNode) {
    this.store.dispatch(undo({path: node.path}));
    // new UndoAction(node.path, this, this.dispatcher).start();
  }
  
  isPossibleCommit: boolean = true;
  erorrDescription: string = "The current commit is not lastest. Please backup your works offline and refresh this page and paste them."

  async checkoutLastestCommit(){
    if(this.repository != undefined && this.branch != undefined){
      let user = await this.wrapper.user();
      return this.wrapper.branches(this.repository.owner.login, this.repository.name).then(v => {
        return v.find(b => b.name == this.branch.name);
      }).then(branch => { 
          let lastestBranch = branch;
          
          let isLastest = (this.branch.commit.sha == lastestBranch.commit.sha)
          let isMine = (user.login == this.repository.owner.login);
          this.erorrDescription = ''
          if(!isLastest)
            this.erorrDescription = "The current commit is not lastest. Please backup your works offline and refresh this page and paste them."
          if(!isMine)
            this.erorrDescription = "It is not supported to push a repository you don't own."

          this.isPossibleCommit = isLastest && isMine;
      })
    }else{
      Promise.reject('invalid state.');
    }
  }
}
