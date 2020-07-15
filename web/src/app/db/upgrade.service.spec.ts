import { TestBed } from '@angular/core/testing';

import { UpgradeService } from './upgrade.service';

describe('UpgradeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpgradeService = TestBed.get(UpgradeService);
    expect(service).toBeTruthy();
  });
});
