import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output, ViewChild, OnDestroy } from '@angular/core';
import { GithubTreeNode, GithubNode, NodeStateAction } from '../tree/github-tree-node';
import { Stage } from './stage';
import { WrapperService } from 'src/app/github/wrapper.service';
import { TreeNode, TreeComponent } from 'angular-tree-component';
import { FormControl } from '@angular/forms';
import { labelTable, getLabel } from '../info/info.component';
import { SelectAction } from '../core/action/user/select-action';
import { UserActionDispatcher } from '../core/action/user/user-action-dispatcher';
import { Store, createSelector, select, createFeatureSelector } from '@ngrx/store';
import { undo, resetWorkspace, nodeSelectedInChangesTree, nodeSelected, stageLoaded, stageUnloaded } from '../workspace.actions';
import { workspaceReducerKey, WorkspaceState } from '../workspace.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit, OnChanges, Stage, OnDestroy {
  @ViewChild("tree1", { static: true })
  treeComponent: TreeComponent;

  @Input("repository") repository;
  @Input("tree") tree: GithubTreeNode;
  @Input("placeholder") placeholder: string = '';
  @Input("modifiedNodes") modifiedNodes: GithubTreeNode[];
  @Output("commit") clickCommit: EventEmitter<string> = new EventEmitter<string>();
  @Input("branch") branch;
  NodeStateAction = NodeStateAction;
  globalSelectedPath: string;
  description = new FormControl('');
  options = {
    scrollOnActivate: false,
  };

  constructor(private dispatcher: UserActionDispatcher, private wrapper: WrapperService, private store: Store) { }

  ngOnInit() {
    this.ngrx();
    console.debug("stage init");
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.repository != undefined && this.branch != undefined)
      this.checkoutLastestCommit()
    if(this.modifiedNodes != undefined){
      this.treeComponent.treeModel.update();
      setTimeout(() => {
        this.store.dispatch(stageLoaded({}));
      }, 0);

      // let index = this.modifiedNodes.findIndex((v, idx) => (v.state as NodeStateAction[]).findIndex(v => v == NodeStateAction.Deleted) == -1)
      // if(index != -1){
      //   setTimeout(() => {
      //     let currentNode = this.treeComponent.treeModel.getActiveNode();
      //     if(currentNode?.data != this.modifiedNodes[index])
      //       this.selectNode(this.modifiedNodes[index].path);
      //   }, 0);
      // }
    }
  }

  ngOnDestroy(){
    this.store.dispatch(stageUnloaded({}));
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  subscriptions: Array<Subscription> = [];

  ngrx() {
    let feature = createFeatureSelector(workspaceReducerKey);
    let pathSelector = createSelector(feature, (state: WorkspaceState) => state.selectedPath);
    let stageLoadedSelector = createSelector(feature, (state: WorkspaceState) => state.stageLoaded);
    let selectedPath$ = this.store.pipe(select(createSelector(pathSelector, stageLoadedSelector, (path, stageLoaded) => ({path, stageLoaded}))));
    let s2 = selectedPath$.subscribe(({path, stageLoaded}) => {
      if(stageLoaded){
        if(!this.modifiedNodes?.find(n => n.path == path)){
          this.selectNode(this.modifiedNodes?.[0]?.path);
        }else
          this.selectNode(path);
      }
    });
    this.subscriptions.push(s2);
  }

  /**
   * return null if the node does not exist
   * @param path 
   */
  private selectNode(path: string): GithubTreeNode{
      let node: TreeNode = this.treeComponent.treeModel.getNodeBy((e: TreeNode) => e.data.path == path) // TODO when treecomponent is not ready
      if (node != null) {
        node.setIsActive(true);
        this.onSelectNode(node);
        return node.data;
      } else {
        this.store.dispatch(nodeSelectedInChangesTree({ node: undefined }));
        console.warn(`${path} was not found`);
        return null;
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
  
  onSelectNode(node: TreeNode){
    if((node.data.state as NodeStateAction[]).findIndex(v => v == NodeStateAction.Deleted) == -1)
      this.store.dispatch(nodeSelectedInChangesTree({node: node.data.toGithubNode()}));
  }

  undoAll(){
    this.store.dispatch(resetWorkspace({}));
  }

  undo(node:GithubTreeNode) {
    this.store.dispatch(undo({path: node.path}));
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
