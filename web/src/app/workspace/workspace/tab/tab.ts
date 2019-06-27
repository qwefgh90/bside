import { toBase64String } from '@angular/compiler/src/output/source_map';
import { EventEmitter } from '@angular/core';

export interface Tab {
    addTab(path: string);
    removeTab(path: string);
    // selectTab(path: string);
    exists(path: string);
    clear();
    readonly tabs: string[];
}
