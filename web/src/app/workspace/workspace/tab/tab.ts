import { toBase64String } from '@angular/compiler/src/output/source_map';
import { EventEmitter } from '@angular/core';

export interface Tab {
    clear();
    addTab(path: string);
    readonly tabs: string[];
}
