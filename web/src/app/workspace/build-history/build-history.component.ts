import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WrapperService } from 'src/app/github/wrapper.service';

const ELEMENT_DATA: any[] = [
  { name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { name: 'Helium', weight: 4.0026, symbol: 'He' },
  { name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { name: 'Boron', weight: 10.811, symbol: 'B' },
  { name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
@Component({
  selector: 'app-build-history',
  templateUrl: './build-history.component.html',
  styleUrls: ['./build-history.component.css']
})
export class BuildHistoryComponent implements OnInit {
  loading = false;
  owner: string;
  repositoryName: string;
  displayedColumns: string[] = ['status', 'updateDate', 'duration', 'who'];
  dataSource = [];
  html_url: string;
  branch: string;
  path: string;
  status: string;
  pageActivated: boolean = false;
  convertToDS(arr: any[]) {
    return arr.map(e => {
      return {
        status: e.status
        , updateDate: e.updated_at
        , duration: e.duration
        , who: e.pusher.login
      }
    })
  }

  constructor(
    private dialogRef: MatDialogRef<BuildHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public wrapper: WrapperService) {
    this.owner = data.owner;
    this.repositoryName = data.repositoryName;
  }

  ngOnInit() {
    this.loading = true;
    this.wrapper.getPageBranch(this.owner, this.repositoryName).then((obj) => {
      try {
        this.html_url = obj.html_url;
        this.status = obj.status;
        this.branch = obj.source.branch;
        this.path = obj.source.path;
        if (this.branch != undefined) {
          this.pageActivated = true;
        }
      }
      finally {
        this.loading = false;
      }

    });
    this.wrapper.buildStatus(this.owner, this.repositoryName).then((arr) => {
      this.dataSource = this.convertToDS(arr);
    });
  }

}
