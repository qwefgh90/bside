import { WorkspaceCreateMicroAction } from './workspace-create-micro-action';

describe('WorkspaceCreateMicroAction', () => {
  it('should create an instance', () => {
    expect(new WorkspaceCreateMicroAction('')).toBeTruthy();
  });
});
