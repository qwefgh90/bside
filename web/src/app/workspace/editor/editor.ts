import * as monacoNameSpace from 'monaco-editor';
import { WorkspaceChild } from '../workspace/workspace-child';

export interface Editor extends WorkspaceChild{
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
