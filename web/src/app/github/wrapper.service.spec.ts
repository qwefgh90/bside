import { TestBed } from '@angular/core/testing';

import { WrapperService } from './wrapper.service';
import { OAuthService } from '../oauth/service/o-auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WrapperService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {provide: OAuthService}
    ], imports: [HttpClientTestingModule]}));

  it('should be created', () => {
    const service: WrapperService = TestBed.get(WrapperService);
    expect(service).toBeTruthy();
  });
});
