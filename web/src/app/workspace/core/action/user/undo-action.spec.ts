import { UndoAction } from './undo-action';
import { UserActionDispatcher } from './user-action-dispatcher';

describe('UndoAction', () => {
  it('should create an instance', () => {
    expect(new UndoAction('', undefined, new UserActionDispatcher())).toBeTruthy();
  });
});
