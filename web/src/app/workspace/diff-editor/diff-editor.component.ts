import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import * as monacoNameSpace from 'monaco-editor';
import { MonacoService } from '../editor/monaco.service';
import { Subscription, Observable } from 'rxjs';
import { DiffEditor } from './diff-editor';

@Component({
  selector: 'app-diff-editor',
  templateUrl: './diff-editor.component.html',
  styleUrls: ['./diff-editor.component.css']
})
export class DiffEditorComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy, DiffEditor{
  @Output("changeContent") changeContent: EventEmitter<string> = new EventEmitter<string>();

  editor: monacoNameSpace.editor.IStandaloneDiffEditor;
  model: monacoNameSpace.editor.ITextModel

  @ViewChild("editor") editorContent: ElementRef;

  subscription: Subscription;
  monaco: any;
  option: monacoNameSpace.editor.IDiffEditorConstructionOptions = {
    readOnly: true,
    theme: "vs",
    automaticLayout: true
  };

  constructor(private monacoService: MonacoService) { }

  private _readonly: boolean;
  set readonly(v: boolean){
    this._readonly;
    this.option.readOnly = v;
    this.editor.updateOptions(this.option);
  }
  get readonly(){
    return this._readonly;
  }

  ngOnInit() {
    this.subscription = this.monacoService.monaco.subscribe((monaco) => {
      console.log("monacoService loaded");
      this.monaco = monaco;
      this.createMonacoEditor(monaco);
    })
  }

  ngOnChanges() {
  }

  ngAfterViewInit() {
  }

  /**
   * resize() is needed for shrinking and expanding editor.
   * @param event 
   */
  onResize(event) {
    if (window.innerHeight <= this.beforeHeight) {
      console.log('shrink and expand!');
      this.shrinkExpand();
    }
    this.beforeHeight = window.innerHeight;
  }
  beforeHeight = 0;
  shrink = false;

  /**
   * it triggers recalculate dimension
   */
  public shrinkExpand(){
    this.shrink = true;
    setTimeout(() => {
      this.shrink = false;
    }, 400);
  }

  // https://ngohungphuc.wordpress.com/2019/01/08/integrate-monaco-editor-with-angular/
  // Will be called once monaco library is available
  private createMonacoEditor(monaco) {
    if (monaco != undefined) {
      const myDiv: HTMLDivElement = this.editorContent.nativeElement;
      if (this.editor != undefined) {
        this.editor.dispose();
        myDiv.childNodes.forEach((c) => c.remove());
      }
      this.editor = monaco.editor.createDiffEditor(myDiv, this.option);
    }
  }

  private releaseEditor(){
    if (this.editor != undefined) {
      console.debug("release resources of monaco editor");
      this.editor.dispose();
    }
  }

  private releaseGlobalResource(){
    if (this.editor != undefined) {
      let models: Array<monacoNameSpace.editor.ITextModel> = this.monaco.editor.getModels()
      models.forEach(m => m.dispose());
    }
  }

  ngOnDestroy() {
    this.releaseEditor();
    this.releaseGlobalResource();
    if(this.subscription)
      this.subscription.unsubscribe();
  }

  setContent(original: monacoNameSpace.editor.ITextModel, changes: monacoNameSpace.editor.ITextModel){
    if (this.monaco != undefined) {
      this.editor.setModel({original: original, modified: changes});
    }else
      this.throwWhenNotInitialized();
  }

  throwWhenNotInitialized(){
    throw new Error("A monaco is not initalized");
  }

}
