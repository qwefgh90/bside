import { CreateAction } from './create-action';
import { UserActionDispatcher } from './user-action-dispatcher';

describe('CreateAction', () => {
  it('should create an instance', () => {
    expect(new CreateAction('',undefined, new UserActionDispatcher())).toBeTruthy();
  });
});
