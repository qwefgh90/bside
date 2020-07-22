import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import * as monacoNameSpace from 'monaco-editor';
import { MonacoService } from '../editor/monaco.service';
import { Subscription, Observable } from 'rxjs';
import { DiffEditor } from './diff-editor';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-diff-editor',
  templateUrl: './diff-editor.component.html',
  styleUrls: ['./diff-editor.component.css']
})
export class DiffEditorComponent implements OnInit, OnDestroy {
  @ViewChild("editor", { static: true }) editorElement: ElementRef;
  @ViewChild("loading", { static: true }) loadingElement: ElementRef;

  diffEditor: monacoNameSpace.editor.IDiffEditor;
  subscription: Subscription;
  monaco: any;
  option: monacoNameSpace.editor.IDiffEditorConstructionOptions = {
    automaticLayout: true
  };

  constructor(private monacoService: MonacoService,  private deviceService: DeviceDetectorService) { }

  subscriptions: Subscription[] = [];

  ngOnInit() {
    this.subscriptions.push(this.monacoService.monaco.subscribe((monaco) => {
      console.log("diff component loaded");
      this.monaco = monaco;
      this.createDiffEditor(monaco);
    }));
  }

  /**
   * resize() is needed for shrinking and expanding editor.
   * @param event 
   */
  onResize(event) {
    if (window.innerWidth < this.beforeWidth && this.deviceService.isDesktop()) {
      this.shrinkExpand();
    }
    // this.beforeHeight = window.innerHeight;
    this.beforeWidth = window.innerWidth;
  }
  beforeWidth = 0;

  private shrink(){
    if(this.editorElement && this.loadingElement){
      (this.editorElement.nativeElement as HTMLElement).style.display = "none";
      (this.loadingElement.nativeElement as HTMLElement).style.display = "flex";
    }
  }

  private expand(){
    if(this.editorElement && this.loadingElement){
      (this.editorElement.nativeElement as HTMLElement).style.display = "block";
      (this.loadingElement.nativeElement as HTMLElement).style.display = "none";
    } 
  }

  /**
   * it triggers recalculate dimension
   */
  public shrinkExpand() {
    this.shrink();
    setTimeout(() => {
      this.expand();
      if (this.latestSnapshot)
        this.diffWith(this.latestSnapshot.path, this.latestSnapshot.content, this.latestSnapshot.originalPath, this.latestSnapshot.originalContent);
    }, 0);
  }

  private createDiffEditor(monaco) {
    if (monaco != undefined) {
      this.releaseEditors();
      const myDiv: HTMLDivElement = this.editorElement.nativeElement;
      this.diffEditor = monaco.editor.createDiffEditor(myDiv, this.option);
    }
  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.releaseEditors();
    this.releaseModels();
  }

  private releaseModels(){
    this.models.forEach(m => m.dispose());
  }

  private releaseEditors() {
    console.debug("release resources of monaco editor");
    this.diffEditor?.dispose();
    this.diffEditor = undefined;
  }

  models: Array<monacoNameSpace.editor.ITextModel> = [];
  latestSnapshot: {path: string, content: string, originalPath: string, originalContent: string};
  diffWith(path: string, content: string, originalPath: string, originalContent: string) {
    if(this.monaco)
      this.createDiffEditor(this.monaco);
    let originalModel: monacoNameSpace.editor.ITextModel = this.monaco.editor.createModel(originalContent, '', monacoNameSpace.Uri.file(`/diff${Date.now()}/${originalPath}`));
    let targetModel: monacoNameSpace.editor.ITextModel = this.monaco.editor.createModel(content, '', monacoNameSpace.Uri.file(`/diff${Date.now()+1}/${path}`));
    this.diffEditor.setModel({ original: originalModel, modified: targetModel });
    this.models.push(originalModel);
    this.models.push(targetModel);
    this.latestSnapshot = {path, content, originalContent, originalPath};
  }

}
