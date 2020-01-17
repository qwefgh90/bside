import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WrapperService } from 'src/app/github/wrapper.service';

export enum ActionState {
  Save, Edit
}

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit, OnChanges {
  ActionState = ActionState;
  @Input("repository") repository: any
  @Input("dirtyCount") dirtyCount: number
  @Input("isBeingChanged") isBeingChanged: boolean
  @Output("buildHistory") buildHistory = new EventEmitter<void>();
  @Output("stage") stage = new EventEmitter<void>();
  @Output("edit") edit = new EventEmitter<void>();
  @Output("save") _save = new EventEmitter<void>();

  selectedBtn: ActionState = ActionState.Edit;
  htmlUrl: string;

  constructor(private wrapper: WrapperService) { }

  ngOnInit() {
  }
  ngOnChanges(s: SimpleChanges) {
    if (s['repository'] != undefined) {
      let repo = s['repository'].currentValue;
      if (repo != undefined) {
        let pageBranch = this.wrapper.getPageBranch(repo.owner.login, repo.name);
        pageBranch.then((v) => {
          if (v == undefined)
            this.htmlUrl = undefined;
          else
            this.htmlUrl = v.html_url;
        }, () => {
          this.htmlUrl = undefined;
        })
      }
    }
  }

  select(v: ActionState) {
    if (this.selectedBtn != v) {
      this.selectedBtn = v;
      if (v == ActionState.Edit)
        this.onEdit();
      else if (v == ActionState.Save)
        this.onSave();
    }
  }

  save(){
    this._save.emit();
  }

  onSave() {
    if (this.dirtyCount > 0)
      this.stage.emit();
  }

  onEdit() {
    this.edit.emit();
  }


  showBuildHistory(){
    this.buildHistory.emit();
  }
}
