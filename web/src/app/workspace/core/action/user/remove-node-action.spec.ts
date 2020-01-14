import { RemoveNodeAction } from './remove-node-action';
import { UserActionDispatcher } from './user-action-dispatcher';

describe('RemoveNode', () => {
  it('should create an instance', () => {
    expect(new RemoveNodeAction('', undefined, new UserActionDispatcher())).toBeTruthy();
  });
});
