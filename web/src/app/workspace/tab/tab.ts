import { toBase64String } from '@angular/compiler/src/output/source_map';
import { EventEmitter } from '@angular/core';
import { WorkspaceChild } from '../workspace/workspace-child';

export interface Tab extends WorkspaceChild {
    clear();
    addTab(path: string);
    readonly tabs: string[];
}
