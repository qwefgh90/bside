import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, OnChanges, OnDestroy, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as monacoNameSpace from 'monaco-editor';
import { MonacoService } from './monaco.service';
import { Subscription, Subject } from 'rxjs';
import { Editor } from './editor';
import { TypeState } from 'typestate';
import { WorkspacePack } from '../workspace/workspace-pack';
import { TextUtil, FileType } from '../text/text-util';
import { DeviceDetectorService } from 'ngx-device-detector';
import { debounceTime } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { notifyChangesInContent, editorLoaded } from '../workspace.actions';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy, Editor {

  editor: monacoNameSpace.editor.IStandaloneCodeEditor;
  model: monacoNameSpace.editor.ITextModel
  notifyContentChangeSubject: Subject<string> = new Subject();

  @ViewChild("editor", { static: true }) editorElement: ElementRef;
  @ViewChild("loading", { static: true }) loadingElement: ElementRef;

  diffTargetPath: string;
  subscriptions: Subscription[] = [];
  monaco: any;
  option: monacoNameSpace.editor.IEditorConstructionOptions = {
    automaticLayout: true
  };

  constructor(private monacoService: MonacoService, private deviceService: DeviceDetectorService, private store: Store) {
   
  }

  private _readonly: boolean;
  set readonly(v: boolean) {
    this._readonly;
    this.option.readOnly = v;
    this.editor.updateOptions(this.option); //TODO bug
  }
  get readonly() {
    return this._readonly;
  }

  ngOnInit() {
    this.subscriptions.push(this.monacoService.monaco.subscribe((monaco) => {
      console.log("monacoService loaded");
      this.monaco = monaco;
      this.createMonacoEditor(monaco);
    }));
    this.subscriptions.push(this.notifyContentChangeSubject.subscribe((path) => {
      this.store.dispatch(notifyChangesInContent({ path }));
    }));
  }

  load(pack: WorkspacePack | undefined) {
    pack?.editorPacks?.forEach((v) => {
      let content;
      let type = TextUtil.getFileType(v.path);
      if (type == FileType.Text) {
        content = TextUtil.base64ToString(v.base64);
      } else {
        content = v.base64;
      }
      this.setContent(v.path, content);
    });
    this.store.dispatch(editorLoaded({}));
  }

  ngAfterViewInit() {
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
    (this.editorElement.nativeElement as HTMLElement).style.display = "none";
    (this.loadingElement.nativeElement as HTMLElement).style.display = "flex";
  }

  private expand(){
    (this.editorElement.nativeElement as HTMLElement).style.display = "block";
    (this.loadingElement.nativeElement as HTMLElement).style.display = "none";
  }

  /**
   * it triggers recalculate dimension
   */
  public shrinkExpand() {
    this.shrink();
    setTimeout(() => {
      this.expand();
      if(this.latestPath)
        this.select(this.latestPath);
    }, 0);
  }

  // https://ngohungphuc.wordpress.com/2019/01/08/integrate-monaco-editor-with-angular/
  // Will be called once monaco library is available
  private createMonacoEditor(monaco) {
    if (monaco != undefined) {
      this.releaseEditors();
      const myDiv: HTMLDivElement = this.editorElement.nativeElement;
      this.editor = monaco.editor.create(myDiv, this.option);
    }
  }

  private releaseEditors() {
    console.debug("release resources of monaco editor");
    this.editor?.dispose();
    this.editor = undefined;
  }

  private releaseGlobalResource() {
    if (this.editor != undefined) {
      let models: Array<monacoNameSpace.editor.ITextModel> = this.monaco.editor.getModels()
      models.forEach(m => m.dispose());
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.releaseGlobalResource();
    this.releaseEditors();
  }

  setContent(path: string, content: string) {
    if (this.monaco != undefined) {
      this.createMonacoEditor(this.monaco);
      let existsModel: monacoNameSpace.editor.ITextModel = (path != undefined) ? this.monaco.editor.getModel(monacoNameSpace.Uri.file(path)) : path;
      if (existsModel) {
        existsModel.setValue(content);
        this.editor.setModel(existsModel);
      } else {
        this.model = this.monaco.editor.createModel(content, '', monacoNameSpace.Uri.file(path));
        this.model.onDidChangeContent((e) => {
          this.notifyContentChangeSubject.next(path);
        })
      }
    } else
      this.throwWhenNotInitialized();
  }

  latestPath: string;

  select(path: string): boolean {
    this.latestPath = path;
    if (this.monaco != undefined) {
      this.createMonacoEditor(this.monaco);
      let existsModel: monacoNameSpace.editor.ITextModel = (path != undefined) ? this.monaco.editor.getModel(monacoNameSpace.Uri.file(path)) : path;
      if (existsModel) {
        this.editor.setModel(existsModel);
        return true;
      }
      return false;
    } else
      this.throwWhenNotInitialized();
  }

  exist(path: string): boolean {
    if (this.monaco != undefined) {
      let existsModel: monacoNameSpace.editor.ITextModel = (path != undefined) ? this.monaco.editor.getModel(monacoNameSpace.Uri.file(path)) : path;
      if (existsModel) {
        return true;
      }
      return false;
    } else
      this.throwWhenNotInitialized();
  }

  getContent(path?: string): string {
    if (this.monaco != undefined) {
      if (path == undefined) {
        let v = this.editor.getModel().getValue();
        return v;
      } else {
        const uri = monacoNameSpace.Uri.file(path)
        let m: monacoNameSpace.editor.ITextModel = this.monaco.editor.getModel(uri);
        if (m == undefined)
          return undefined
        else
          return m.getValue();
      }
    } else
      this.throwWhenNotInitialized();
  }

  private getModel(path?: string): monacoNameSpace.editor.ITextModel {
    if (this.monaco != undefined) {
      if (path == undefined) {
        let v = this.editor.getModel();
        return v;
      } else {
        const uri = monacoNameSpace.Uri.file(path)
        let m: monacoNameSpace.editor.ITextModel = this.monaco.editor.getModel(uri);
        if (m == undefined)
          return undefined
        else
          return m;
      }
    } else
      this.throwWhenNotInitialized();
  }

  removeContent(path: string): boolean {
    if (this.monaco != undefined) {
      let existsModel: monacoNameSpace.editor.ITextModel = (path != undefined) ? this.monaco.editor.getModel(monacoNameSpace.Uri.file(path)) : path;
      if (existsModel) {
        existsModel.dispose();
        return true;
      }
      return false;
    } else
      this.throwWhenNotInitialized();
  }

  md() {
  }

  getPathList() {
    if (this.monaco != undefined) {
      let models: Array<monacoNameSpace.editor.ITextModel> = this.monaco.editor.getModels();
      return models.map(m => m.uri.path.substr(1));
    } else
      this.throwWhenNotInitialized();
  }

  clear() {
    if (this.monaco != undefined) {
      this.getPathList().forEach(path => {
        this.removeContent(path);
      });
    } else
      this.throwWhenNotInitialized();
  }

  throwWhenNotInitialized() {
    throw new Error("A monaco is not initalized");
  }
}
