import { TestBed } from '@angular/core/testing';

import { LocalUploadService } from './local-upload.service';

describe('LocalUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalUploadService = TestBed.get(LocalUploadService);
    expect(service).toBeTruthy();
  });
});
