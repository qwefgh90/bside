import { Component, OnInit, EventEmitter, Output, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Tab } from './tab';
import { MatTab, MatTabGroup } from '@angular/material';
import { WorkspaceService, WorkspaceCommand } from '../workspace.service';
import { filter } from 'rxjs/operators';
import { WorkspacePack } from '../workspace-pack';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit, Tab, OnChanges {

  constructor(private workspaceService: WorkspaceService) { }

  @Input("loadedPack") loadedPack: WorkspacePack;

  _tabs: string[] = [];
  _tabsSet: Set<string> = new Set<string>();

  selectedTabindex: number;
  selectedPath: string;

  @ViewChild(MatTabGroup) group: MatTabGroup;

  ngOnInit() {
    this.workspaceService.commandChannel.pipe(filter((v, idx) => v.source != this))
      .subscribe((command) => {
      if(command instanceof WorkspaceCommand.SelectNode){
        if (!this.exists(command.path)) {
          this.addTab(command.path);
        }
        if(this.selectedPath != command.path){
          // this.selectTab(command.path);
          let path = command.path;
          if (this.exists(path)) {
            // console.log(`before ${this.selectedTabindex}`)
            this.selectedPath = path;
            let selectedTabIndex = this.findTabIndex(path);
            this.selectedTabindex = selectedTabIndex;
            // console.log(`after ${this.selectedTabindex}`)
            this.workspaceService.selectNode(this, path);
            return true;
          }
        }
      }
      else if(command instanceof WorkspaceCommand.RemoveNode){
        this.removeTab(command.node.path);
      }
      else if(command instanceof WorkspaceCommand.CloseTab){
      }else if(command instanceof WorkspaceCommand.MoveNodeInTree){
      if (this.exists(command.fromPath)) {
        this.renameTab(command.fromPath, command.to.path);
      }
      }else{
        //console.trace(`It can't handle ${typeof command}.`)
      }
    });
  }

  ngOnChanges(changes: SimpleChanges){
    if (changes.loadedPack.currentValue != undefined && changes.loadedPack.previousValue == undefined) {
      console.debug("the pack is loaded");
      changes.loadedPack.currentValue.tabs.forEach(v => {
        this.addTab(v);
      });
      this.selectTab(changes.loadedPack.currentValue.selectedNodePath);
    } 
  }

  tabSelected(tab: MatTab){
    console.log(`current ${this.selectedTabindex} - ${this.selectedPath}`)
    if(tab == undefined)
      this.selectTab(undefined);
    else
      this.selectTab(tab.textLabel);
  }

  addTab(path: string){
    if (!this._tabsSet.has(path)) {
      this._tabs.push(path);
      this._tabsSet.add(path);
      // this.add.emit(path);
    }
  }

  /**
   * if that index is over the range after removing, tabSelected() is called. so don't care about that condition.
   * @param path
   */
  removeTab(path: string) {
    if (this._tabsSet.has(path)) {
      let currentIndex = this._tabs.findIndex((v) => this.selectedPath == v);
      let index = this._tabs.findIndex((v) => path == v);
      let beforeSelectedIndex = currentIndex;
      if (index != -1) {
        this._tabs.splice(index, 1);
        this._tabsSet.delete(path);
      }
      if ((this._tabs.length) > 0) {
        if (beforeSelectedIndex < this._tabs.length)
          this.selectTab(this._tabs[beforeSelectedIndex]);
        else if (beforeSelectedIndex == this._tabs.length)
          this.selectTab(this._tabs[beforeSelectedIndex - 1]);
      }else{
        this.selectTab(undefined);
      }
    }
  }

  private selectTab(path: string){
    if (this.exists(path)) {
      // console.log(`before ${this.selectedTabindex}`)
      this.selectedPath = path;
      // let selectedTabIndex = this.findTabIndex(path);
      // this.selectedTabindex = selectedTabIndex;
      // console.log(`after ${this.selectedTabindex}`)
      this.workspaceService.selectNode(this, path);
      return true;
    }else {
      this.workspaceService.selectNode(this, path);
      return false;
    }
  }

  /**
   * if a path doesn't exist in tabs, return -1;
   * @param path 
   */
  private findTabIndex(path: string){
    return this._tabs.findIndex((v) =>
      v == path
    );
  }

  private renameTab(path: string, newPath: string){
    const index = this.findTabIndex(path);
    if(index != -1){
      this._tabs[index] = newPath;
      this._tabsSet.delete(path);
      this._tabsSet.add(newPath);
    }
  }

  exists(path: string){
    return this._tabsSet.has(path);
  }

  get tabs(): string[]{
    return this._tabs;
  }

  getFileName(path: string): string{
    let index = path.lastIndexOf('/');
    if(index == -1){
      return path;
    }else
      return path.substring(index+1);
  }

  clear(){
    this._tabs.splice(0, this._tabs.length);
    this._tabsSet.clear();
    this.selectedPath = undefined;
  }
}
