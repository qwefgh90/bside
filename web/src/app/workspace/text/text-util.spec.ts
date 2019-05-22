import { TextUtil, FileType } from './text-util';

describe('TextUtil', () => {
  it('getFileType()', () => {
    expect(TextUtil.getFileType('a.png')).toBe(FileType.Image);
    expect(TextUtil.getFileType('a.jpg')).toBe(FileType.Image);
    expect(TextUtil.getFileType('a.jpeg')).toBe(FileType.Image);
    expect(TextUtil.getFileType('a.gif')).toBe(FileType.Image);
    expect(TextUtil.getFileType('a.txt')).toBe(FileType.Text);
    expect(TextUtil.getFileType('a.json')).toBe(FileType.Text);
    expect(TextUtil.getFileType('a.pdf')).toBe(FileType.Other);
    expect(TextUtil.getFileType('a.xlsx')).toBe(FileType.Other);
  })

  it('encode() and decode()', () => {
    let sample = 'Hello 안녕 こんにちは 你好';
    let arr = TextUtil.encode(sample, "utf-8");
    let base64 = TextUtil.bytesToBase64(arr);
    expect("SGVsbG8g7JWI64WVIOOBk+OCk+OBq+OBoeOBryDkvaDlpb0=").toBe(base64);
    let arr2 = TextUtil.base64ToBytes("SGVsbG8g7JWI64WVIOOBk+OCk+OBq+OBoeOBryDkvaDlpb0=");
    let result = TextUtil.decode(arr2, "utf-8");
    expect(result).toBe(sample);
  })

});
