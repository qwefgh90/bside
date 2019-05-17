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
  private shrinkExpand(){
    this.shrink = true;
    setTimeout(() => {
      this.shrink = false;
    }, 100);
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

  setContent(path: string, content: string) {
    if (this.monaco != undefined) {
      let existsModel: monacoNameSpace.editor.ITextModel = (path != undefined) ? this.monaco.editor.getModel(monacoNameSpace.Uri.file(path)) : path;
      if (existsModel)
        existsModel.setValue(content);
      else {
        this.model = this.monaco.editor.createModel(content, '', monacoNameSpace.Uri.file(path));
        this.model.onDidChangeContent((e) => {
          console.log(e);
        })
      }
    }else
      this.throwWhenNotInitialized();
  }

  selectTab(path: string): boolean {
    if (this.monaco != undefined) {
      let existsModel: monacoNameSpace.editor.ITextModel = (path != undefined) ? this.monaco.editor.getModel(monacoNameSpace.Uri.file(path)) : path;
      if (existsModel) {
        this.editor.setModel(existsModel);
        return true;
      }
      return false;
    }else
      this.throwWhenNotInitialized();
  }

  exist(path: string): boolean{
    if (this.monaco != undefined) {
      let existsModel: monacoNameSpace.editor.ITextModel = (path != undefined) ? this.monaco.editor.getModel(monacoNameSpace.Uri.file(path)) : path;
      if (existsModel) {
        return true;
      }
      return false;
    }else
      this.throwWhenNotInitialized();
  }

  getContent(path?: string): string {
    if (this.monaco != undefined) {
      if(path == undefined){
        let v = this.editor.getModel().getValue();
        return v;
      }else{
        const uri = monacoNameSpace.Uri.file(path)
        let m: monacoNameSpace.editor.ITextModel = this.monaco.editor.getModel(uri);
        if(m == undefined)
          return undefined
        else
          return m.getValue();
      }
    }else
      this.throwWhenNotInitialized();
  }

  removeContent(path: string): boolean{
    if (this.monaco != undefined) {
      let existsModel: monacoNameSpace.editor.ITextModel = (path != undefined) ? this.monaco.editor.getModel(monacoNameSpace.Uri.file(path)) : path;
      if (existsModel) {
        existsModel.dispose();
        return true;
      }
      return false;
    }else
      this.throwWhenNotInitialized();
  }

  throwWhenNotInitialized(){
    throw new Error("A monaco is not initalized");
  }

  changes: Observable<void>;
}
