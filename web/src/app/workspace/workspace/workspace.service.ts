import { Injectable } from '@angular/core';
import { Subject, Observable, Scheduler, ReplaySubject } from 'rxjs';
import * as eq from 'fast-deep-equal';
import { GithubTreeNode } from '../tree/github-tree-node';
import { GithubTree } from '../tree/github-tree';
import { observeOn, distinctUntilChanged, debounce, debounceTime, flatMap } from 'rxjs/operators';
import { async } from 'rxjs/internal/scheduler/async';
import { ReplaceSource } from 'webpack-sources';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private commandQueue: ReplaySubject<WorkspaceCommand.Command> = new ReplaySubject<WorkspaceCommand.Command>(1);
  private commandQueueObservable = this.commandQueue.asObservable().pipe(observeOn(async));
  private lastCommand: WorkspaceCommand.Command;
  private globalDebounceTime = 50;
  constructor() {
    WorkspaceCommand.SelectNode.internalQueue.asObservable()
    .pipe(debounceTime(this.globalDebounceTime)).subscribe((v) => this.emit(v));
    WorkspaceCommand.CloseTab.internalQueue.pipe(observeOn(async)).pipe(debounceTime(this.globalDebounceTime)).subscribe((v) => this.emit(v));
    WorkspaceCommand.CreateNode.internalQueue.pipe(observeOn(async)).pipe(debounceTime(this.globalDebounceTime)).subscribe((v) => this.emit(v));
    WorkspaceCommand.RemoveNode.internalQueue.pipe(observeOn(async)).pipe(debounceTime(this.globalDebounceTime)).subscribe((v) => this.emit(v));
    WorkspaceCommand.MoveNodeInTree.internalQueue.pipe(observeOn(async)).subscribe((v) => this.emit(v));
    WorkspaceCommand.UndoAll.internalQueue.pipe(observeOn(async)).pipe(debounceTime(this.globalDebounceTime)).subscribe((v) => this.emit(v));
    WorkspaceCommand.Save.internalQueue.pipe(observeOn(async))
    .pipe(debounceTime(2000 + this.globalDebounceTime)).subscribe(
      (v) => this.emit(v)
    );
    WorkspaceCommand.NotifyContentChange.internalQueue.pipe(observeOn(async)).pipe(debounceTime(3000 + this.globalDebounceTime)).subscribe((v) => this.emit(v));
  }

  private emit(command: WorkspaceCommand.Command){
    // if(!eq(this.lastCommand, command)){
      this.commandQueue.next(command);
      // this.lastCommand = command;
    // }
  }

  selectNode(source: any, path: string){
    let c = new WorkspaceCommand.SelectNode(path, source);
    WorkspaceCommand.SelectNode.internalQueue.next(c);
  }

  closeTab(source: any, path: string){
    let c = new WorkspaceCommand.CloseTab(path, source);
    WorkspaceCommand.CloseTab.internalQueue.next(c);
  }

  createNode(source: any, node: GithubTreeNode){
    let c = new WorkspaceCommand.CreateNode(node, source);
    WorkspaceCommand.CreateNode.internalQueue.next(c);
  }

  removeNode(source: any, node: GithubTreeNode){
    let c = new WorkspaceCommand.RemoveNode(node, source);
    WorkspaceCommand.RemoveNode.internalQueue.next(c);
  }

  moveNodeInTree(source: any, fromPath: string, to: GithubTreeNode){
    let c = new WorkspaceCommand.MoveNodeInTree(fromPath, to, source);
    WorkspaceCommand.MoveNodeInTree.internalQueue.next(c);
  }

  save(source: any){
    let c = new WorkspaceCommand.Save(source);
    WorkspaceCommand.Save.internalQueue.next(c);
  }

  notifyContentChange(source: any, path: string){
    let c = new WorkspaceCommand.NotifyContentChange(path, source);
    WorkspaceCommand.NotifyContentChange.internalQueue.next(c);
  }
  
  undoAll(source: any){
    let c = new WorkspaceCommand.UndoAll(source);
    WorkspaceCommand.UndoAll.internalQueue.next(c);
  }
  
  get commandChannel(): Observable<WorkspaceCommand.Command>{
    return this.commandQueueObservable;
  }
}

export namespace WorkspaceCommand {
  export type Command =  RemoveNode | CloseTab | MoveNodeInTree | SelectNode | Save | UndoAll;

  export class RemoveNode{
    constructor(public node: GithubTreeNode, public source: any) {
    }
    static internalQueue = new Subject<RemoveNode>();
  }

  export class CreateNode{
    constructor(public node: GithubTreeNode, public source: any) {
    }
    static internalQueue = new Subject<CreateNode>();
  }

  export class MoveNodeInTree{
    constructor(public fromPath: string, public to: GithubTreeNode, public source: any) {
    }
    static internalQueue = new Subject<MoveNodeInTree>();
  }

  export class CloseTab{
    constructor(public path: string, public source: any) {
    }
    static internalQueue = new Subject<CloseTab>();
  }
  
  export class SelectNode{
    constructor(public path: string, public source: any) {
    }
    static internalQueue = new Subject<SelectNode>();
  }
  
  export class NotifyContentChange{
    constructor(public path: string, public source: any) {
    }
    static internalQueue = new Subject<SelectNode>();
  }

  export class Save{
    constructor(public source: any) {
    }
    static internalQueue = new Subject<Save>();
  }
  export class UndoAll{
    constructor(public source: any) {
    }
    static internalQueue = new Subject<UndoAll>();
  }
}