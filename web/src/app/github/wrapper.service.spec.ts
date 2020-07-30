import { TestBed } from '@angular/core/testing';
import { WrapperService } from './wrapper.service';
import { OAuthService } from '../oauth/service/o-auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState as appInitialState } from '../app.reducer';
import { authReducerKey, initialState as authInitialState } from '../oauth/auth.reducer';

describe('WrapperService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {provide: OAuthService},      
      provideMockStore({initialState: {app: {...appInitialState, user: undefined}, [authReducerKey]: {...authInitialState, isLogin: true, isPrivate: false}}}),
    ], imports: [HttpClientTestingModule]}));

  it('should be created', () => {
    const service: WrapperService = TestBed.get(WrapperService);
    expect(service).toBeTruthy();
  });
});
