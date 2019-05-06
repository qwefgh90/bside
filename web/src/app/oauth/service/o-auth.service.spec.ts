import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { OAuthService } from './o-auth.service';

describe('OAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[HttpClientTestingModule]
  }));

  it('intialOAuthInfo()', (done: DoneFn) => {
    const service: OAuthService = TestBed.get(OAuthService);
    expect(service).toBeTruthy();
    service.intialOAuthInfo().then(v => {
      expect(v.client_id).toBeDefined();
      expect(v.state).toBeDefined();
      done();
    });

    const httpTestingController = TestBed.get(HttpTestingController);
    const req = httpTestingController.expectOne('/oauth/init');
    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    req.flush({state: '', client_id: ''});

    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  });
  
});
