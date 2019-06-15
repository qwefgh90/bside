import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { Tab } from './tab';
import { MatTab, MatTabGroup } from '@angular/material';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit, Tab {

  constructor() { }

  _tabs: string[] = [];
  _tabsSet: Set<string> = new Set<string>();

  @ViewChild(MatTabGroup) group: MatTabGroup;

  // @Output("add") add: EventEmitter<string> = new EventEmitter<string>();
  @Output("select") select: EventEmitter<string> = new EventEmitter<string>();
  // @Output("remove") remove: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit() {
  }

  selectedTabindex: number;

  tabSelected(tab: MatTab){
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
      let index = this._tabs.findIndex((v) => path == v);
      let beforeSelectedIndex = this.selectedTabindex;
      if (index != -1) {
        this._tabs.splice(index, 1);
        this._tabsSet.delete(path);
        // this.remove.emit(path);
      }
      if ((this._tabs.length) > 0) {
        if (beforeSelectedIndex < this._tabs.length)
          this.selectTab(this._tabs[beforeSelectedIndex]);
        else if (beforeSelectedIndex == this._tabs.length)
          this.selectTab(this._tabs[beforeSelectedIndex - 1]);
      }
    }
  }

  selectTab(path: string){
    if (this.exists(path)) {
      let selectedTabIndex = this.findTabIndex(path);
      if(selectedTabIndex != this.selectedTabindex){
        this.selectedTabindex = selectedTabIndex
        this.select.emit(path);
      }
      return true;
    }else {
      this.select.emit(path);
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

  exists(path: string){
    return this._tabsSet.has(path);
    // return (this._tabs.findIndex((v) => v == path) != -1)
  }

  get tabs(): string[]{
    return this._tabs.splice(0);
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
    this.selectedTabindex = undefined;
  }
}
