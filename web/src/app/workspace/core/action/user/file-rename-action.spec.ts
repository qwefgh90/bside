import { FileRenameAction } from './file-rename-action';

describe('FileRenameAction', () => {
  it('should create an instance', () => {
    expect(new FileRenameAction('old','old','new','new')).toBeTruthy();
  });
});
