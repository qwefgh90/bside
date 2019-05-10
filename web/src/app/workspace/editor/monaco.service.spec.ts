import { TestBed } from '@angular/core/testing';

import { MonacoService } from './monaco.service';

describe('MonacoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonacoService = TestBed.get(MonacoService);
    expect(service).toBeTruthy();
  });
});
