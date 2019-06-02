import { Component, OnInit, EventEmitter, Output } from '@angular/core';

export enum ActionState{
  Save, Edit
}

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit {
  ActionState = ActionState;
  @Output("stage") stage = new EventEmitter<void>();
  @Output("edit") edit = new EventEmitter<void>();

  selectedBtn: ActionState = ActionState.Edit;
  
  constructor() { }

  ngOnInit() {
  }

  select(v: ActionState){
    this.selectedBtn = v;
    if(v == ActionState.Edit)
      this.onEdit();
    else if(v == ActionState.Save)
      this.onSave();
  }

  onSave(){
    this.stage.emit();
  }

  onEdit(){
    this.edit.emit();
  }

}
