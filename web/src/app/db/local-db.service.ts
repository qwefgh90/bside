import { Injectable } from '@angular/core';
import { Database } from './database';
import { WorkspacePack } from '../workspace/workspace/workspace-pack';
import * as LZString from 'lz-string';
import { Cookie } from './cookie';

@Injectable({
  providedIn: 'root'
})
export class LocalDbService implements Database, Cookie {
  
  constructor(){
    this.initCookie();
  }

  private initCookie(){
    this.autoLogin = localStorage.getItem(this.autoLoginKey) == "1" ? true : false;
    this.includingPrivate = localStorage.getItem(this.includingPrivateKey) == "1" ? true : false;
  }

  autoLoginKey = "autoLogin";
  _autoLogin: boolean;
  set autoLogin(_autoLogin: boolean){
    this._autoLogin = _autoLogin;
    localStorage.setItem(this.autoLoginKey, _autoLogin ? "1" : "0");
  }
  get autoLogin(){
    return this._autoLogin;
  }
  
  includingPrivateKey = "includingPrivate";
  _includingPrivate: boolean;
  set includingPrivate(_includingPrivate: boolean){
    this._includingPrivate = _includingPrivate;
    localStorage.setItem(this.includingPrivateKey, _includingPrivate ? "1" : "0");
  }
  get includingPrivate(){
    return this._includingPrivate;
  }

  storage = window.localStorage;

  save(pack: WorkspacePack): void {
    let packString = JSON.stringify(pack);
    let compressedPackString = LZString.compressToUTF16(packString);
    
    try{
      console.log(`Saving ${compressedPackString.length}(${packString.length}) of characters to ${pack.repositoryId+pack.commit_sha}`);
      this.storage.setItem(pack.repositoryId + '-' + pack.branchName + '-' + pack.commit_sha, compressedPackString);
    }catch(e){
      console.error(e);
    }
  }

  get(repositoryId: number, branchName: string, commit_sha: string): Promise<WorkspacePack> {
    let json = this.storage.getItem(repositoryId + '-' + branchName + '-' + commit_sha);
    if(json != undefined && json != '')
      return Promise.resolve(JSON.parse(LZString.decompressFromUTF16(json)) as WorkspacePack);
    else 
      return Promise.reject("Data for last workspace doesn't exist.");
  }

  list(repositoryId: number): Promise<Array<WorkspacePack>>{
    let res = [];
    Object.keys(this.storage).forEach(k => {
        let json = localStorage.getItem(k);
        try{
          if(json != undefined && json != ''){
            let pack = JSON.parse(LZString.decompressFromUTF16(json)) as WorkspacePack;
            if(repositoryId == pack.repositoryId)
              return res.push(pack);
          }
        }catch(e){}
      }
    )
    return Promise.resolve(res);
  }

  delete(repositoryId: number, branchName: string, commit_sha: string){
    this.storage.removeItem(repositoryId + '-' + branchName + '-' + commit_sha);
  }
}
