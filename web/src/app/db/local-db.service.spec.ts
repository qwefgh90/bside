import { TestBed } from '@angular/core/testing';

import { LocalDbService } from './local-db.service';

describe('LocalDbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalDbService = TestBed.get(LocalDbService);
    expect(service).toBeTruthy();
  });
});
