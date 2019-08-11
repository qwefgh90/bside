import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FileType, TextUtil } from '../text/text-util';
import { NodeStateAction } from '../tree/github-tree-node';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<InfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DisplayInfo) {
      
     }

  ngOnInit() {
  }

  getLabel: (v: NodeStateAction) => any = getLabel;
}

export interface DisplayInfo{
  name: string;
  path: string;
  size: number;
  mime: string;
  rawUrl: string;
  states: NodeStateAction[];
}

export let labelTable = {
  "C": {short: "C", name: "Created"},
  "CM": {short: "CM", name: "Modified content"},
  "M": {short: "M", name: "Moved"},
  "NM": {short: "NM", name: "Modified name"},
  "D": {short: "D", name: "Deleted"},
  "T": {short: "T", name: "Changed tree"},
  "U": {short: "U", name: "Uploaded"},
  "E": {short: "E", name: "ETC"},
};

export function getLabel(v: NodeStateAction) {
  if (v == NodeStateAction.Created)
    return labelTable["C"];
  else if (v == NodeStateAction.ContentModified)
    return labelTable["CM"];
  else if (v == NodeStateAction.Moved)
    return labelTable["M"];
  else if (v == NodeStateAction.NameModified)
    return labelTable["NM"];
  else if (v == NodeStateAction.Deleted)
    return labelTable["D"];
  else if (v == NodeStateAction.NodesChanged)
    return labelTable["T"];
  else if (v == NodeStateAction.Uploaded)
    return labelTable["U"];
  else 
    return labelTable["E"];
}