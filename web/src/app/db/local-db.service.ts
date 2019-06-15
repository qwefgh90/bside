import { Injectable } from '@angular/core';
import { Database } from './database';
import { WorkspacePack } from '../workspace/workspace/workspace-pack';

@Injectable({
  providedIn: 'root'
})
export class LocalDbService implements Database{
  save(pack: WorkspacePack){
    // this.storage.setItem(pack.commit_sha, JSON.stringify(pack));
  }
  
  get(commit_sha: string): WorkspacePack{
    return undefined;
    // return JSON.parse(this.storage.getItem(commit_sha)) as WorkspacePack;
  }
  
  get storage(): Storage{
    return window.localStorage;
  }
  
  constructor() { }
}
