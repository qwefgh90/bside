import { toByteArray, fromByteArray } from 'base64-js';
import * as jschardet from 'jschardet';
import { TextDecoderLite, TextEncoderLite } from 'text-encoder-lite';
import * as mime from 'mime';
import * as mimeDb from 'mime-db'

export enum FileType {
    Image, Text, Other
}

export class TextUtil {

    private constructor(){ }

    static decode(bytes, encoding: string) {
        let decoder = new (TextDecoderLite == undefined ? TextDecoder : TextDecoderLite)(encoding != null ? encoding.toLowerCase() : 'utf-8')
        let result = decoder.decode(bytes);
        return result;
    }

    static encode(text: string, encoding: string): Uint8Array {
        let encoder = new (TextEncoderLite == undefined ? TextEncoder : TextEncoderLite)(encoding);
        let result = encoder.encode(text)
        return result;
    }

    static base64ToBytes(str: string): Uint8Array {
        let arr = str.split("\n").map(v => {
            return v;
        });

        let bytes = toByteArray(arr.join(''));
        return bytes;
    }

    static bytesToBase64(arr: Uint8Array): string {
        let base64 = fromByteArray(arr);
        return base64;
    }

    static getEncoding(bytes): string {
        let string = '';
        for (var i = 0; i < bytes.length; ++i) {
            string += String.fromCharCode(bytes[i]);
        }
        let encoding = jschardet.detect(string).encoding;
        console.debug('detected encoding: ' + encoding);
        return encoding;
    }

    static getFileType(name: string) {
        const mimeName: string = mime.getType(name);
        const mimeInfo = mimeDb[mime.getType(name)]
        let compressible = (mimeInfo != undefined) && (mimeInfo.compressible != undefined) ? mimeInfo.compressible : true; // unknown is considered as compressible
        console.debug(`mimeInfo ${mimeInfo}`);
        console.debug(`compressible: ${compressible}`);
        if (mimeName != null && mimeName.toLocaleLowerCase().startsWith('image/'))
            return FileType.Image;
        else if ((mimeName != null && mimeName.toLocaleLowerCase().startsWith('text/') || compressible)) {
            return FileType.Text
        } else {
            return FileType.Other
        }
    }
}
