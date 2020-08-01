import { toByteArray, fromByteArray } from 'base64-js';
import { TextDecoderLite, TextEncoderLite } from 'text-encoder-lite';
import * as mime from 'mime';
import * as mimeDb from 'mime-db'

export enum FileType {
    Image, Text, Other
}

export class TextUtil {

    private constructor() { }

    static decode(bytes, encoding: string = 'utf-8') {
        let decoder = new (TextDecoder != undefined ? TextDecoder : TextDecoderLite)(encoding.toLowerCase())
        let result = decoder.decode(bytes);
        return result;
    }

    static encode(text: string, encoding: string = 'utf-8'): Uint8Array {
        let encoder = new (TextEncoder != undefined ? TextEncoder : TextEncoderLite)(encoding.toLowerCase());
        let result = encoder.encode(text)
        return result;
    }

    static base64ToBytes(str: string): Uint8Array {
        let arr = str.split("\n").map(v => {
            return v;
        });
        try {
            let bytes = toByteArray(arr.join(''));
            return bytes;
        } catch (e) {
            console.error(e);
            return new Uint8Array();
        }
    }

    static bytesToBase64(arr: Uint8Array): string {
        let base64 = fromByteArray(arr);
        return base64;
    }

    static stringToBase64(text: string, encoding: string = 'utf-8'): string {
        return this.bytesToBase64(this.encode(text, encoding));
    }

    static base64ToString(base64: string, encoding: string = 'utf-8'): string {
        return this.decode(this.base64ToBytes(base64), encoding);
    }

    static getFileType(name: string): FileType {
        const mimeName: string = mime.getType(name);
        const mimeInfo = mimeDb[mime.getType(name)]
        let compressible = (mimeInfo != undefined) && (mimeInfo.compressible != undefined) ? mimeInfo.compressible : true; // unknown is considered as compressible
        if (mimeName != null && mimeName.toLocaleLowerCase().startsWith('image/'))
            return FileType.Image;
        else if ((mimeName != null && mimeName.toLocaleLowerCase().startsWith('text/') || compressible)) {
            return FileType.Text
        } else {
            return FileType.Other
        }
    }

    static getFileName(path: string): string {
        let index = path.lastIndexOf('/');
        if (index == -1) {
            return path;
        } else
            return path.substring(index + 1);
    }

    static getMime(fileName: string) {
        return mime.getType(fileName);
    }
}
