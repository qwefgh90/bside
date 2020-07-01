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
import { Store, createFeatureSelector, createSelector, select } from '@ngrx/store';
import { clickTab, updateTabSnapshot } from '../workspace.actions';
import { workspaceReducerKey, WorkspaceState } from '../workspace.reducer';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit, Tab, OnChanges, AfterContentInit, OnDestroy {

  selectedIndex = new FormControl(0);

  constructor(private store: Store<{}>) {
    let feature = createFeatureSelector(workspaceReducerKey);
    let pathSelector = createSelector(feature, (state: WorkspaceState) => state.selectedPath);
    let nodeSelector = createSelector(feature, (state: WorkspaceState) => state.selectedNode);
    let removedPathSelector = createSelector(feature, (state: WorkspaceState) => state.latestRemovedPath);
    let renamedPathSelector = createSelector(feature, (state: WorkspaceState) => state.latestRenamingPath);
    let saveRequestSelector = createSelector(feature, (state: WorkspaceState) => state.latestSnapshot.requestTime);
    let selectedPathAndNode$ = this.store.pipe(select(createSelector(pathSelector, nodeSelector, (path, node) => ({path, node}) )));
    selectedPathAndNode$.subscribe(({path, node}) => {
      if(node){
        let selectedPath = this._tabs[this.selectedIndex.value];
        if(selectedPath != path)
          this.selectTabOrInsertSelect(path);
      }
    });
    let removedPath$ = this.store.pipe(select(removedPathSelector));
    removedPath$.subscribe(path => {
      this.removeTab(path);
    });
    let renamedPath$ = this.store.pipe(select(renamedPathSelector));
    renamedPath$.subscribe((renameInfo) => {
      if(renameInfo)
        this.renameTab(renameInfo.oldPath, renameInfo.newPath);
    });
    
    let s0 = this.store.select(saveRequestSelector).subscribe((requestTime) => {
      this.store.dispatch(updateTabSnapshot({snapshot: {tabs: Array.from(this.tabs)}}));
    });

    this.selectedIndex.valueChanges.subscribe((value) => {
      let tab = this._tabs[value];
      this.dispatchSelectMessage(tab);
    });

    this.subscriptions.push(s0);
  }

  // actionAfterTabInitialized: () => void;
  _tabs: string[] = [];
  _tabsSet: Set<string> = new Set<string>();

  subscriptions: Subscription[] = [];
  // selectedTabindex: number;
  selectedPath: string;

  @ViewChild(MatTabGroup, { static: true }) group: MatTabGroup;

  ngOnInit() {
    let actionSubject = MicroActionComponentMap.getSubjectByComponent(SupportedComponents.TabComponent);
    let s = actionSubject.subscribe((micro: MicroAction<any>) => {
      if (micro instanceof TabRenameMicroAction) {
      } else if (micro instanceof TabSelectAction) {
      } else if (micro instanceof TabCloseMicroAction) {
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
  }

  ngAfterContentInit() {
  }

  indexFromChangeTab;

  changeTabIndexWithPath(path: string) {
    let selectedTabIndex = this.findTabIndex(path);
    if (selectedTabIndex != -1) {
      this.selectedIndex.setValue(selectedTabIndex);
    }
  }

  private selectTabOrInsertSelect(path: string) {
    if (path) {
      if (!this.exists(path)) 
        this.addTab(path);
      this.changeTabIndexWithPath(path);
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
          this.changeTabIndexWithPath(this._tabs[beforeSelectedIndex]);
        else if (beforeSelectedIndex == this._tabs.length)
          this.changeTabIndexWithPath(this._tabs[beforeSelectedIndex-1]);
      } else {
      }
    }
  }

  private dispatchSelectMessage(path: string) {
    this.store.dispatch(clickTab({path}));
    // new SelectAction(path, this, this.userActionDispatcher).start()
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
    this.selectedIndex.setValue(0);
  }
}
