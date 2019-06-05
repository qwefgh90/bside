export class UploadFile{
    constructor(
        public parentPath: string,
        public name: string,
        public type: string,
        public size: number,
        public base64: string | ArrayBuffer){
    }
}
