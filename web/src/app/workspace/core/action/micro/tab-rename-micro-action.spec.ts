import { TabRenameMicroAction } from './tab-rename-micro-action';

describe('TabRenameMicroAction', () => {
  it('should create an instance', () => {
    expect(new TabRenameMicroAction('old','old','new','new')).toBeTruthy();
  });
});
