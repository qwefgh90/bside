import { GithubTreeRenameMicroAction } from './github-tree-rename-micro-action';

describe('GithubTreeRenameMicroAction', () => {
  it('should create an instance', () => {
    expect(new GithubTreeRenameMicroAction('old','old','new','new')).toBeTruthy();
  });
});
