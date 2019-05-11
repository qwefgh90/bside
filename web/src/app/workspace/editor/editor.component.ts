import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, OnChanges, OnDestroy } from '@angular/core';
import * as monacoNameSpace from 'monaco-editor';
import { MonacoService } from './monaco.service';
import { Subscription, Observable } from 'rxjs';
import { Editor } from './editor';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy, Editor {

  editor: monacoNameSpace.editor.IStandaloneCodeEditor;
  model: monacoNameSpace.editor.ITextModel

  @ViewChild("editor") editorContent: ElementRef;

  subscription: Subscription;
  monaco: any;

  constructor(private monacoService: MonacoService) { }

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
    console.log(event);
    if (window.innerHeight <= this.beforeHeight) {
      // console.log('shrink');
      this.shrinkExpand();
    }
    this.beforeHeight = window.innerHeight;
  }
  beforeHeight = 0;
  shrink = false;

  /**
   * it triggers recalculate dimension
   */
  private shrinkExpand(){
    this.shrink = true;
    setTimeout(() => {
      this.shrink = false;
    });
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
      let option: monacoNameSpace.editor.IEditorConstructionOptions = {
        value: [""].join("\n"),
        language: "javascript",
        theme: "vs",
        automaticLayout: true

      };
      this.editor = monaco.editor.create(myDiv, option);
    }
  }

  private releaseEditor(){
    if (this.editor != undefined) {
      console.debug("release resources of monaco editor");
      this.editor.dispose();

    }
  }

  private releaseGlobalResource(){
    let models: Array<monacoNameSpace.editor.ITextModel> = this.monaco.editor.getModels()
    models.forEach(m => m.dispose());
  }

  ngOnDestroy() {
    this.releaseEditor();
    // const myDiv: HTMLDivElement = this.editorContent.nativeElement;
    // myDiv.childNodes.forEach((c) => c.remove());
    this.releaseGlobalResource();
    this.subscription.unsubscribe();
  }

  setContent(path: string, content: string) {
    if (this.monaco != undefined) {
      let existsModel: monacoNameSpace.editor.ITextModel = this.monaco.editor.getModel(monacoNameSpace.Uri.file(path));
      if (existsModel)
        existsModel.setValue(content);
      else {
        this.model = this.monaco.editor.createModel(content, '', monacoNameSpace.Uri.file(path));
        this.editor.setModel(this.model);
      }
    }
  }

  selectTabIfExists(path: string): boolean {
    if (this.monaco != undefined) {
      let existsModel: monacoNameSpace.editor.ITextModel = this.monaco.editor.getModel(monacoNameSpace.Uri.file(path));
      if (existsModel) {
        this.editor.setModel(existsModel);
        return true;
      }
      return false;
    }
  }

  getContent(): string {
    if (this.monaco != undefined) {
      let v = this.editor.getModel().getValue();
      return v;
    }else
      return "";
  }

  changes: Observable<void>;
}
