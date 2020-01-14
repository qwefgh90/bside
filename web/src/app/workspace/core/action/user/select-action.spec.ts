import { SelectAction } from './select-action';
import { UserActionDispatcher } from './user-action-dispatcher';

describe('SelectAction', () => {
  it('should create an instance', () => {
    expect(new SelectAction('', undefined, new UserActionDispatcher())).toBeTruthy();
  });
});
