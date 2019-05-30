import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit {

  
  @Output("stage") stage = new EventEmitter<void>();
  @Output("edit") edit = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onSave(){
    this.stage.emit();
  }

  onEdit(){
    this.edit.emit();
    
  }

}
