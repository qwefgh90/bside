import { Injectable } from '@angular/core';
import { Store, createSelector } from '@ngrx/store';
import { IndexedDBState } from './indexed-db.reducer';
import { databaseIsNotSupported, databaseUpgraded, databaseUpgradeFailed, databaseIsReady } from './indexed-db.actions';
import { databaseName, currentVersion, latestVersionInfo } from './db-version';
import { UpgradeService } from './upgrade.service';
import { WorkspacePack } from '../workspace/workspace/workspace-pack';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  constructor(private store: Store<{}>,
    private upgradeService: UpgradeService) {
    this.ngrx();
    this.initialize();
  }
  ngrx() {
    let dbSelector = (state: { indexedDB: IndexedDBState }) => state.indexedDB;
    let readySelector = createSelector(dbSelector, state => state.ready);
    let s0 = this.store.select(readySelector).subscribe((ready) => {
      this.ready = ready;
    });
  }

  ready = false;
  db: IDBDatabase;

  private initialize() {
    if (!window.indexedDB) {
      this.store.dispatch(databaseIsNotSupported({}));
      return false;
    }
    let request = indexedDB.open(databaseName, currentVersion);
    request.onupgradeneeded = (ev) => {
      let upgrade = this.upgradeService.upgrade(ev);
      upgrade.then(() => {
        this.store.dispatch(databaseUpgraded({ oldVersion: ev.oldVersion, newVersion: ev.newVersion }));
      }, (reason) => {
        request.transaction.abort();
        this.store.dispatch(databaseUpgradeFailed({ reason }));
      });
    };
    request.onsuccess = (ev) => {
      this.db = request.result;
      this.store.dispatch(databaseIsReady({}));
    };
  }

  private async checkStatus(){
    if(this.ready)
      return Promise.resolve();
    else
      return Promise.reject("The database is not ready.");
  }

  /**
   * It returns the store whose name is a storeName variable.
   * transaction live shortly
   * @param storeName 
   */
  private getStore(storeName: string){
    let tran = this.db.transaction(storeName, "readwrite");
    let store = tran.objectStore(storeName);
    return {tran, store};
  }

  private getIndex(storeName: string, indexName: string){
    let {tran, store} = this.getStore(storeName);
    let index = store.index(indexName);
    return {tran, store, index};
  }

  async getRepositories(){
    await this.checkStatus();
    let {store, tran} = this.getStore(latestVersionInfo.workspacePackStoreName);
    let req = store.getAll();
    return new Promise<Array<WorkspacePack>>((res, rej) => {
      req.onsuccess = (ev) => {
        let arr = (req.result) as Array<WorkspacePack>;
        res(arr);
      };
      req.onerror = (ev) => {
        rej(ev);
      }
    });
  }

  private async getByRepositoryID(id: number){
    await this.checkStatus();
    const indexName = "repositoryId";
    let {tran, store, index} = this.getIndex(latestVersionInfo.workspacePackStoreName, indexName);
    let request = index.getAll(id);
    return new Promise<Array<WorkspacePack>>((resolve, rej) => {
      request.onsuccess = (ev) => {
        let arr = (request.result as Array<WorkspacePack>);
        return resolve(arr);
      };
      request.onerror = (ev) => {
        return rej(ev);
      };
    });
  }

  async getByRepositoryIDAndBranchAndSha(id: number, branchName: string, sha: string){
    return this.getByRepositoryID(id).then((arr) => {
      let results = arr.filter((pack) => pack.branchName == branchName && pack.commit_sha == sha);
      if(results.length == 1)
        return results[0];
      else
        throw Error("The requested pack does not exist.");
    });
  }

  async deleteByRepositoryIDAndBranchAndSha(id: number, branchName: string, sha: string){
    let repo = await this.getByRepositoryIDAndBranchAndSha(id, branchName, sha);
    let key: number = repo[latestVersionInfo.keyPropertyName];
    let {tran, store} = this.getStore(latestVersionInfo.workspacePackStoreName);
    return new Promise<WorkspacePack>((res, rej) => {
      let req = store.delete(key);
      req.onsuccess = (ev) => {
        res(repo);
      };
      req.onerror = (ev) => {
        rej(ev);
      };
    });
  }

  async savePack(pack: WorkspacePack){
    await this.checkStatus();
    await this.deleteByRepositoryIDAndBranchAndSha(pack.repositoryId, pack.branchName, pack.commit_sha).catch(reason => {
      console.debug(`There is no repository which is ${pack.repositoryId}, ${pack.branchName}, ${pack.commit_sha}`);
    });
    let {store, tran} = this.getStore(latestVersionInfo.workspacePackStoreName);
    let req = store.add(pack);
    return new Promise<number>((res, rej) => {
      req.onsuccess = ev => {
        res(Number.parseInt(req.result.toString()));
      }
      req.onerror = ev => {
        rej(ev);
      }
    });
  }
}
