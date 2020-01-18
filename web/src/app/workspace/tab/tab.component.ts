import { Component, OnInit, EventEmitter, Output, ViewChild, Input, OnChanges, SimpleChanges, AfterContentInit, OnDestroy } from '@angular/core';
import { Tab } from './tab';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { filter } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { WorkspacePack } from '../workspace/workspace-pack';
import { MicroActionComponentMap, SupportedComponents } from '../core/action/micro/micro-action-component-map';
import { MicroAction } from '../core/action/micro/micro-action';
import { TabRenameMicroAction } from '../core/action/micro/tab-rename-micro-action';
import { TabSelectAction } from '../core/action/micro/tab-select-action';
import { TabCloseMicroAction } from '../core/action/micro/tab-close-micro-action';
import { SelectAction } from '../core/action/user/select-action';
import { TabSnapshotMicroAction } from '../core/action/micro/tab-snapshot-micro-action';
import { UserActionDispatcher } from '../core/action/user/user-action-dispatcher';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit, Tab, OnChanges, AfterContentInit, OnDestroy {

  constructor(private userActionDispatcher: UserActionDispatcher) { }

  actionAfterTabInitialized: () => void;
  _tabs: string[] = [];
  _tabsSet: Set<string> = new Set<string>();

  subscriptions: Subscription[] = [];
  selectedTabindex: number;
  selectedPath: string;

  @ViewChild(MatTabGroup, { static: true }) group: MatTabGroup;

  ngOnInit() {
    let actionSubject = MicroActionComponentMap.getSubjectByComponent(SupportedComponents.TabComponent);
    let s = actionSubject.subscribe((micro: MicroAction<any>) => {
      if (micro instanceof TabRenameMicroAction) {
        try {
          this.renameTab(micro.oldPath, micro.newPath);
          micro.succeed(() => { this.renameTab(micro.newPath, micro.oldPath) });
        } catch{
          micro.fail();
        }
      } else if (micro instanceof TabSelectAction) {
        try {
          if ((this.selectedPath != micro.selectedPath)) {
            let path = micro.selectedPath;
            this.select(path);
          }
          micro.succeed(() => { 
            let addedPath = micro.selectedPath;
            this.removeTab(addedPath);
          });
        } catch {
          micro.fail();
        }
      } else if (micro instanceof TabCloseMicroAction) {
        try {
          let path = micro.removedPath;
          this.removeTab(path);
          micro.succeed(() => { this.select(path) });
        } catch{
          micro.fail();
        }
      } else if (micro instanceof TabSnapshotMicroAction) {
        const tabs = Array.from(this.tabs);
        micro.succeed(() => { }, tabs);
      }
    })
    this.subscriptions.push(s);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  /**
   * It must be called after parent's ngAfterContentInit
   */
  load(loadedPack: WorkspacePack) {
    console.debug("the pack is loaded");
    this.clear();
    loadedPack.tabs.forEach(v => {
      this.addTab(v);
    });
    // this.changeTab(loadedPack.selectedNodePath);
    // this.executeSelectAction(loadedPack.selectedNodePath);
  }

  ngAfterContentInit() {
  }

  indexFromChangeTab;

  changeTab(path: string) {
    if (typeof path == 'string') {
      if (this.selectedPath != path) {
        if (this.exists(path)) {
          let selectedTabIndex = this.findTabIndex(path);
          if (selectedTabIndex != -1){
            this.selectedTabindex = selectedTabIndex;
            this.selectedPath = path;
          }
        }
      }
    }
  }

  private select(path: string) {
    if (path != undefined) {
      if (!this.exists(path)) {
        this.addTab(path);
      }
      this.changeTab(path);
    }
  }

  tabSelected(tab: MatTab) {
    if (this.actionAfterTabInitialized != undefined) {
      this.actionAfterTabInitialized();
      this.actionAfterTabInitialized = undefined;
    }
    if (tab != undefined){
      this.changeTab(tab.textLabel);
        this.executeSelectAction(tab.textLabel);
      
    }
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
          this.executeSelectAction(this._tabs[beforeSelectedIndex]);
        else if (beforeSelectedIndex == this._tabs.length)
          this.executeSelectAction(this._tabs[beforeSelectedIndex - 1]);
      } else {
        this.executeSelectAction(undefined);
      }
    }
  }

  private executeSelectAction(path: string) {
    new SelectAction(path, this, this.userActionDispatcher).start()
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
