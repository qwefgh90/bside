import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, OnChanges, OnDestroy } from '@angular/core';
import * as monacoNameSpace from 'monaco-editor';
import { MonacoService } from './monaco.service';
import { Subscription } from 'rxjs';

declare const monaco;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {

  editor: monacoNameSpace.editor.IStandaloneCodeEditor;

  @ViewChild("editor") editorContent: ElementRef;
  @Input("monacoLoaded") monacoLoaded: boolean;
  subscription: Subscription;
  constructor(private monacoService: MonacoService) { }

  ngOnInit() {
    this.subscription = this.monacoService.loaded.subscribe(() => {
      console.log("monacoService loaded");
      this.loadEditor();
    })
  }

  loadEditor(){
    (window as any).require(["vs/editor/editor.main"], () => {
      this.createMonacoEditor();
    });
  }

  ngAfterViewInit() {
  }


  /**
   * resize() is needed for shrinking editor.
   * @param event 
   */
  onResize(event) {
    console.log(event);
    if (window.innerHeight <= this.beforeHeight) {
      console.log('shrink');
      this.shrink = true;
      setTimeout(() => {
        this.shrink = false;
        // this.editor.layout();
      });
    }
    // this.editor.layout();
    this.beforeHeight = window.innerHeight;
  }
  beforeHeight = 0;
  shrink = false;

  // https://ngohungphuc.wordpress.com/2019/01/08/integrate-monaco-editor-with-angular/
  // Will be called once monaco library is available
  createMonacoEditor() {
    if (monaco != undefined) {
      const myDiv: HTMLDivElement = this.editorContent.nativeElement;
      if (this.editor != undefined) {
        this.editor.dispose();
        myDiv.childNodes.forEach((c) => c.remove());
      }
      let option: monacoNameSpace.editor.IEditorConstructionOptions = {
        value: [
          "function x() {",
          "\tconsole.log('Hello world!');",
          "}"
        ].join("\n"),
        language: "javascript",
        theme: "vs-dark",
        automaticLayout: true

      };
      this.editor = monaco.editor.create(myDiv, option);
    }
  }

  ngOnDestroy(){
    if(this.editor != undefined){
      console.debug("release resources of monaco editor");
      this.editor.dispose();
      const myDiv: HTMLDivElement = this.editorContent.nativeElement;
      myDiv.childNodes.forEach((c) => c.remove());
    }
    this.subscription.unsubscribe();
  }
}
