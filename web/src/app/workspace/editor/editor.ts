import * as monacoNameSpace from 'monaco-editor';

export interface Editor {
    selectTab(path: string): boolean;
    setContent(path: string, content: string);
    exist(path: string): boolean;
    getContent(path?: string): string;
    removeContent(path: string): boolean;
    diffWith(path: string, content: string, originalPath?: string)
    md()
    getPathList(): Array<string>;
    readonly: boolean
    shrinkExpand()
    readonly isDiffOn: boolean;
    readonly isMdOn: boolean;
}
