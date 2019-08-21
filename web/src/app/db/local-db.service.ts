import { Injectable } from '@angular/core';
import { Database } from './database';
import { WorkspacePack } from '../workspace/workspace/workspace-pack';

@Injectable({
  providedIn: 'root'
})
export class LocalDbService implements Database {

  storage = window.localStorage;

  save(pack: WorkspacePack): void {
    let packString = JSON.stringify(pack);
    try{
      console.log(`Saving ${packString.length} characters to ${pack.repositoryId+pack.commit_sha}`);
      this.storage.setItem(pack.repositoryId + '-' + pack.commit_sha, JSON.stringify(pack));
    }catch(e){
      console.error(e);
    }
  }

  get(repositoryId: number, commit_sha: string): Promise<WorkspacePack> {
    let json = this.storage.getItem(repositoryId + '-' + commit_sha);
    if(json != undefined && json != '')
      return Promise.resolve(JSON.parse(json) as WorkspacePack);
    else 
      return Promise.reject("Data for last workspace doesn't exist.");
  }

  list(repositoryId: number): Promise<Array<WorkspacePack>>{
    let res = [];
    Object.keys(this.storage).forEach(k => {
        let json = localStorage.getItem(k);
        if(json != undefined && json != ''){
          let pack = JSON.parse(json) as WorkspacePack;
          if(repositoryId == pack.repositoryId)
            return res.push(pack);
        }
      }
    )
    return Promise.resolve(res);
  }

  delete(repositoryId: number, commit_sha: string){
    this.storage.removeItem(repositoryId + '-' + commit_sha);
  }
}
