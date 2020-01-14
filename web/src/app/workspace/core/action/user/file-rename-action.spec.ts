import { FileRenameAction } from './file-rename-action';
import { UserActionDispatcher } from './user-action-dispatcher';

describe('FileRenameAction', () => {
  it('should create an instance', () => {
    expect(new FileRenameAction('old','old','new','new', undefined, new UserActionDispatcher())).toBeTruthy();
  });
});
