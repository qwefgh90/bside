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

  done(repositoryName, timeout: number=30,  expectingTime: number=10){
    let dotdotdot = [".", "..", "..."]
    let handle: any;
    handle = setInterval(() => {
      this.second += 1;
      this.msg = `Loading ${repositoryName}${dotdotdot[this.second%3]}\nIt takes about ${expectingTime} seconds.`;
      if(this.second > timeout){
        clearInterval(handle);
      }
    }, 1000);
  }

  ngOnDestroy(){
  }

}
