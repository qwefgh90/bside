import { NotifyContentChangeAction } from './notify-content-change-action';
import { UserActionDispatcher } from './user-action-dispatcher';

describe('NotifyContentChangeAction', () => {
  it('should create an instance', () => {
    expect(new NotifyContentChangeAction('',this,new UserActionDispatcher())).toBeTruthy();
  });
});
