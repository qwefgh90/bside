import { OAuthServiceChannel } from './o-auth-service-channel';
import { Subject } from 'rxjs';

describe('OAuthServiceChannel', () => {
  it('should create an instance', () => {
    expect(new OAuthServiceChannel(new Subject())).toBeTruthy();
  });
});
