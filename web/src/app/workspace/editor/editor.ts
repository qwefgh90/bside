import * as monacoNameSpace from 'monaco-editor';
import { WorkspaceChild } from '../workspace/workspace-child';
import { WorkspacePack } from '../workspace/workspace-pack';
import { EventEmitter } from '@angular/core';

export interface Editor extends WorkspaceChild{
    // Component API

    /**
     * select a tab and set a content linked to a tab if a tab which you want to select exists
     * @param path 
     */
    selectTab(path: string): boolean;
    /**
     * replace a content in the model linked to a path if a path exists, otherwise set a content and a path together
     * @param path 
     * @param content 
     */
    setContent(path: string, content: string);
    /**
     * whether a path exists as a model linked to the path
     * @param path 
     */
    exist(path: string): boolean;
    /**
     * return a content if path is not null
     * @param path 
     */
    getContent(path?: string): string;
    /**
     * remove a model linked to a path
     * @param path 
     */
    removeContent(path: string): boolean;
    /**
     * remove all contents in the editor
     */
    clear();

    diffWith(path: string, content: string, originalPath?: string)

    /**
     * go to markdown view
     */
    md()
    /**
     * get a path list
     */
    getPathList(): Array<string>;
    /**
     * change and get readonly mode of the editor
     */
    readonly: boolean
    /**
     * force a editor to resize by shrinking and expanding
     */
    shrinkExpand()
    /**
     * return whether editor is diff view
     */
    readonly isDiffOn: boolean;
    /**
     * return whether editor is md view
     */
    readonly isMdOn: boolean;
}
