import { SaveAction } from './save-action';
import { UserActionDispatcher } from './user-action-dispatcher';

describe('SaveAction', () => {
  it('should create an instance', () => {
    expect(new SaveAction(this, new UserActionDispatcher())).toBeTruthy();
  });
});
