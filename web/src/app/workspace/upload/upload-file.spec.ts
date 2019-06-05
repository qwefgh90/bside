import { UploadFile } from './upload-file';

describe('UploadFile', () => {
  it('should create an instance', () => {
    expect(new UploadFile('','','',0,'')).toBeTruthy();
  });
});
