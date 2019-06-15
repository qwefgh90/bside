import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-commit-progress',
  templateUrl: './commit-progress.component.html',
  styleUrls: ['./commit-progress.component.css']
})
export class CommitProgressComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  _msg: string = "Preparing to commit...";

  prepare(){
    this._msg = "Preparing to commit...";
  }

  uploadBlob(blobName: string){
    this._msg = `Uploading ${blobName}...`;
  }

  uploadBlobs(count: number){
    this._msg = `Uploading ${count} blobs...`
  }

  createTree(){
    this._msg = 'Creating new tree...'
  }

  commit(){
    this._msg = 'Committing...'
  }

  updateBranch(branchName: string){
    this._msg = `Updating ${branchName}...`
  }

  done(){
    this._msg = `Cleaning...`
  }

  msg(msg :string){
    this._msg = msg;
  }

}
