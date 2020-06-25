import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-commit-progress',
  templateUrl: './commit-progress.component.html',
  styleUrls: ['./commit-progress.component.css']
})
export class CommitProgressComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
  }

  msgs = [];

  set msg(_msg:string){
    this.msgs = _msg.split("\n");
  };

  prepare(){
    this.msg = "Preparing to commit...";
  }

  uploadBlob(blobName: string){
    this.msg = `Uploading ${blobName}...`;
  }

  uploadBlobs(count: number){
    this.msg = `Uploading ${count} blobs...`
  }

  createTree(){
    this.msg = 'Creating new tree...'
  }

  commit(){
    this.msg = 'Committing...'
  }

  updateBranch(branchName: string){
    this.msg = `Updating ${branchName}...`
  }

  second = 0;

  done(repositoryName, timeout: number=30){
    let handle: NodeJS.Timeout;
    handle = setInterval(() => {
      this.second += 1;
      this.msg = `Loading ${repositoryName} \n ${this.second}...`;
      if(this.second > timeout){
        clearInterval(handle);
      }
    }, 1000);
  }

  ngOnDestroy(){
  }

}
