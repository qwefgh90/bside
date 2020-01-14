import { ClearAction } from './clear-action';
import { UserActionDispatcher } from './user-action-dispatcher';

describe('ClearAction', () => {
  it('should create an instance', () => {
    expect(new ClearAction(undefined, new UserActionDispatcher())).toBeTruthy();
  });
});
