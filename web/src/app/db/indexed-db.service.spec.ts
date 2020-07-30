import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { initialState as appInitialState } from '../app.reducer';
import { authReducerKey, initialState as authInitialState } from '../oauth/auth.reducer';
import { IndexedDbService } from './indexed-db.service';
import { provideMockStore } from '@ngrx/store/testing';
import { mockWorkspacePack } from '../testing/indexed-db.service.mock';
import { DatabaseToken } from './database';
import { LocalDbService } from './local-db.service';
import { StoreModule, Store } from '@ngrx/store';
import { indexedDBReducer } from './indexed-db.reducer';

describe('IndexedDbService which is ready', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          indexedDB: indexedDBReducer
        }),
      ],
      providers: [
        { provide: DatabaseToken, useClass: LocalDbService },
      ]
    });
    store = TestBed.get(Store);
});

  it('should be created', () => {
    const service: IndexedDbService = TestBed.get(IndexedDbService);
    expect(service).toBeTruthy();
  });

  it('test savePack() and getRepositories() and deleteAll() with packs in diffrent branches', (done: DoneFn) => {
    let isReady = store.select((state: { indexedDB: { ready: boolean } }) => state.indexedDB.ready);
    const service: IndexedDbService = TestBed.get(IndexedDbService);
    isReady.subscribe(async ready => {
      if(ready){
        await service.deleteAll();
        await service.savePack(mockWorkspacePack);
        await service.savePack({...mockWorkspacePack, branchName: "newbranch1"});
        await service.savePack({...mockWorkspacePack, branchName: "newbranch2"});
        await service.savePack({...mockWorkspacePack, branchName: "newbranch3"});
        let pack = await service.getRepositories();
        expect(pack.length).toBe(4);
        await service.deleteAll();
        let packAfterDeleting = await service.getRepositories();
        expect(packAfterDeleting.length).toBe(0);
        done();
      }
    })
  });

  it('test savePack() and getByRepositoryIDAndBranchAndSha() deleteByRepositoryIDAndBranchAndSha()', (done: DoneFn) => {
    let isReady = store.select((state: { indexedDB: { ready: boolean } }) => state.indexedDB.ready);
    const service: IndexedDbService = TestBed.get(IndexedDbService);
    isReady.subscribe(async ready => {
      if (ready) {
        await service.deleteAll();
        await service.savePack(mockWorkspacePack);
        let pack = await service.getByRepositoryIDAndBranchAndSha(mockWorkspacePack.repositoryId,
          mockWorkspacePack.branchName, mockWorkspacePack.commit_sha);
        expect(mockWorkspacePack.repositoryId).toBe(pack.repositoryId);
        expect(mockWorkspacePack.branchName).toBe(pack.branchName);
        expect(mockWorkspacePack.commit_sha).toBe(pack.commit_sha);
        let deletedPack = await service.deleteByRepositoryIDAndBranchAndSha(mockWorkspacePack.repositoryId,
          mockWorkspacePack.branchName, mockWorkspacePack.commit_sha);
        expect(mockWorkspacePack.repositoryId).toBe(deletedPack.repositoryId);
        expect(mockWorkspacePack.branchName).toBe(deletedPack.branchName);
        expect(mockWorkspacePack.commit_sha).toBe(deletedPack.commit_sha);
        done();
      }
    })
  });
});
