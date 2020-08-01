import { Injectable, Inject } from '@angular/core';
import { DatabaseToken, Database } from './database';
import { allVersionInfo } from './db-version';

@Injectable({
  providedIn: 'root'
})
export class UpgradeService {

  constructor(@Inject(DatabaseToken) private old: Database) { }

  async upgrade(ev: IDBVersionChangeEvent) {
    console.debug(ev);
    if (ev.oldVersion < 1) {
      await this.migrateFrom0To1(ev);
    }
    return;
  }
  
  async migrateFrom0To1(ev: IDBVersionChangeEvent) {
    // making new object store
    let db: IDBDatabase = (event.target as any).result;
    var objectStore = db.createObjectStore(allVersionInfo[1].workspacePackStoreName, { keyPath: allVersionInfo[1].keyPropertyName, autoIncrement: true });
    objectStore.createIndex("repositoryId", "repositoryId", { unique: false });
    objectStore.createIndex("branchName", "branchName", { unique: false });
    objectStore.createIndex("commit_sha", "commit_sha", { unique: false });
    // migrate from web storage
    let oldData = await this.old.listAll();
    objectStore.transaction.oncomplete = (event) => {
      let tran = db.transaction(allVersionInfo[1].workspacePackStoreName, "readwrite");
      let store = tran.objectStore(allVersionInfo[1].workspacePackStoreName);
      oldData.forEach((pack) => {
        store.add({...pack, date: undefined}); //date column is added
      });
    };
  }
}
