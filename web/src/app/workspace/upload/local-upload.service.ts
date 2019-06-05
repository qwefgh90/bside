import { Injectable } from '@angular/core';
import { UploadFile } from './upload-file';

@Injectable({
  providedIn: 'root'
})
export class LocalUploadService {

  constructor() { }

  map = new Map<string, UploadFile>();

  set(path: string, uploadFile: UploadFile){
    this.map.set(path, uploadFile);
  }

  get(path: string){
    return this.map.get(path);
  }

  exist(path: string){
    return this.map.has(path);
  }
}
