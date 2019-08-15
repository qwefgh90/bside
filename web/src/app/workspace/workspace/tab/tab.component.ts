import { Component, OnInit, EventEmitter, Output, ViewChild, Input, OnChanges, SimpleChanges, AfterContentInit, OnDestroy } from '@angular/core';
import { Tab } from './tab';
import { MatTab, MatTabGroup } from '@angular/material';
import { WorkspaceService, WorkspaceCommand } from '../workspace.service';
import { filter } from 'rxjs/operators';
import { WorkspacePack } from '../workspace-pack';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit, Tab, OnChanges, AfterContentInit, OnDestroy {

  constructor(private workspaceService: WorkspaceService) { }

  actionAfterTabInitialized: () => void;
  _tabs: string[] = [];
  _tabsSet: Set<string> = new Set<string>();

  subscriptions: Subscription[] = [];
  selectedTabindex: number;
  selectedPath: string;

  @ViewChild(MatTabGroup) group: MatTabGroup;

  ngOnInit() {
    
    let s = this.workspaceService.commandChannel.pipe(filter((v, idx) => v.source != this))
      .subscribe((command) => {
        console.debug(command);
        if (command instanceof WorkspaceCommand.SelectNode) {
          if (command.path != undefined) {
            if (!this.exists(command.path)) {
              this.addTab(command.path);
            }
            this.changeTab(command.path);
          }
        }
        else if (command instanceof WorkspaceCommand.RemoveNode) {
          this.removeTab(command.path);
        }
        else if (command instanceof WorkspaceCommand.CloseTab) {
        } else if (command instanceof WorkspaceCommand.MoveNodeInTree) {
          if (this.exists(command.fromPath)) {
            this.renameTab(command.fromPath, command.to.path);
          }
        }
      });
      this.subscriptions.push(s);
  }

  ngOnDestroy(){
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  
  ngOnChanges(changes: SimpleChanges) {
  }

  /**
   * It must be called after parent's ngAfterContentInit
   * @param pack
   */
  load(loadedPack: WorkspacePack){
    console.debug("the pack is loaded");
    this.clear();
    loadedPack.tabs.forEach(v => {
      this.addTab(v);
    });
    this.changeTab(loadedPack.selectedNodePath);
    this.workspaceService.selectNode(this,loadedPack.selectedNodePath);
    // this.actionAfterTabInitialized = () => this.changeTab(loadedPack.selectedNodePath);
  }

  ngAfterContentInit(){
  }

  changeTab(path: string) {
    if (typeof path == 'string') {
      if (this.selectedPath != path) {
        if (this.exists(path)) {
          this.selectedPath = path;
          let selectedTabIndex = this.findTabIndex(path);
          if(selectedTabIndex != -1)
            this.selectedTabindex = selectedTabIndex;
        }
      }
    }
  }

  tabSelected(tab: MatTab) {
    if(this.actionAfterTabInitialized != undefined){
      this.actionAfterTabInitialized();
      this.actionAfterTabInitialized = undefined;
    }
    if (tab != undefined)
      this.workspaceService.selectNode(this, tab.textLabel);
  }

  addTab(path: string) {
    if (!this._tabsSet.has(path)) {
      this._tabs.push(path);
      this._tabsSet.add(path);
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
          this.workspaceService.selectNode(this, this._tabs[beforeSelectedIndex]);
        else if (beforeSelectedIndex == this._tabs.length)
          this.workspaceService.selectNode(this, this._tabs[beforeSelectedIndex - 1]);
      } else {
        this.workspaceService.selectNode(this, undefined);
      }
    }
  }

  /**
   * if a path doesn't exist in tabs, return -1;
   * @param path 
   */
  private findTabIndex(path: string, _tabs?: string[]) {
    return (_tabs == undefined ? this._tabs : _tabs).findIndex((v) =>
      v == path
    );
  }

  private renameTab(path: string, newPath: string) {
    const index = this.findTabIndex(path);
    if (index != -1) {
      this._tabs[index] = newPath;
      this._tabsSet.delete(path);
      this._tabsSet.add(newPath);
    }
  }

  exists(path: string) {
    return this._tabsSet.has(path);
  }

  get tabs(): string[] {
    return this._tabs;
  }

  getFileName(path: string): string {
    let index = path.lastIndexOf('/');
    if (index == -1) {
      return path;
    } else
      return path.substring(index + 1);
  }

  clear() {
    this._tabs.splice(0, this._tabs.length);
    this._tabsSet.clear();
    this.selectedPath = undefined;
    this.selectedTabindex = undefined;
  }
}
