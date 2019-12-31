import { WorkspaceRenameMicroAction } from './workspace-rename-micro-action';

describe('WorkspaceRenameMicroAction', () => {
  it('should create an instance', () => {
    expect(new WorkspaceRenameMicroAction('old','old','new','new')).toBeTruthy();
  });
});
