import { WorkspaceUndoMicroAction } from './workspace-undo-micro-action';

describe('EditorUndoMicroAction', () => {
  it('should create an instance', () => {
    expect(new WorkspaceUndoMicroAction('')).toBeTruthy();
  });
});
