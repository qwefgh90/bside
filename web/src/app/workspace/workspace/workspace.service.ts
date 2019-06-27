import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import * as eq from 'fast-deep-equal';
import { GithubTreeNode } from '../tree/github-tree-node';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private commandQueue: Subject<WorkspaceCommand.Command> = new Subject<WorkspaceCommand.Command>();
  private lastCommand: WorkspaceCommand.Command;

  constructor() {
  }

  private emit(command: WorkspaceCommand.Command){
    if(!eq(this.lastCommand, command)){
      this.commandQueue.next(command);
      this.lastCommand = command;
    }
  }

  selectTab(source: any, path: string){
    let c = new WorkspaceCommand.SelectTab(path, source);
    this.emit(c);
  }

  closeTab(source: any, path: string){
    let c = new WorkspaceCommand.CloseTab(path, source);
    this.emit(c);
  }

  selectNodeInTree(source: any, node: GithubTreeNode){
    let c = new WorkspaceCommand.SelectNodeInTree(node, source);
    this.emit(c);
  }

  removeNodeInTree(source: any, node: GithubTreeNode){
    let c = new WorkspaceCommand.RemoveNodeInTree(node, source);
    this.emit(c);
  }

  moveNodeInTree(source: any){

  }
  
  get commandChannel(): Observable<WorkspaceCommand.Command>{
    return this.commandQueue.asObservable();
  }
}

export namespace WorkspaceCommand {
  export type Command = SelectNodeInTree | RemoveNodeInTree | CloseTab | WorkspaceCommand.SelectTab | MoveNodeInTree;

  // commands
  export class SelectNodeInTree{
    constructor(public node: GithubTreeNode, public source: any) {
      
    }
  }

  export class RemoveNodeInTree{
    constructor(public node: GithubTreeNode, public source: any) {
      
    }
  }

  export class MoveNodeInTree{
    constructor(public fromPath: string, public to: GithubTreeNode, public source: any) {
      
    }
  }

  export class CloseTab{
    constructor(public path: string, public source: any) {
      
    }
  }
  
  export class SelectTab{
    constructor(public path: string, public source: any) {
      
    }
  }
}