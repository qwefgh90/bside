import { TestBed } from '@angular/core/testing';

import { UpgradeService } from './upgrade.service';
import { DatabaseToken } from './database';
import { LocalDbService } from './local-db.service';

describe('UpgradeService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: DatabaseToken, useClass: LocalDbService},]
    
  }));

  it('should be created', () => {
    const service: UpgradeService = TestBed.get(UpgradeService);
    expect(service).toBeTruthy();
  });
});
