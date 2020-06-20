import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, OnChanges, OnDestroy, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as monacoNameSpace from 'monaco-editor';
import { MonacoService } from './monaco.service';
import { Subscription, Observable, Subject } from 'rxjs';
import { Editor } from './editor';
import { DiffEditor } from '../diff-editor/diff-editor';
import { TypeState } from 'typestate';
import { WorkspacePack } from '../workspace/workspace-pack';
import { TextUtil, FileType } from '../text/text-util';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MarkdownEditorComponent } from '../markdown-editor/markdown-editor.component';
import { NotifyContentChangeAction } from '../core/action/user/notify-content-change-action';
import { UserActionDispatcher } from '../core/action/user/user-action-dispatcher';
import { debounceTime } from 'rxjs/operators';

const prefix: string = 'X'.repeat(100);
enum EditorMode{
  None,
  Diff,
  Md
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy, Editor {

  editor: monacoNameSpace.editor.IStandaloneCodeEditor;
  model: monacoNameSpace.editor.ITextModel
  notifyContentChangeSubject: Subject<string> = new Subject();

  @ViewChild("editor", { static: true }) editorContent: ElementRef;
  @ViewChild("diffeditor1", { static: true }) diffEditor: DiffEditor;
  @ViewChild("markdowneditor", { static: true }) markdownEditor: MarkdownEditorComponent;

  diffTargetPath: string;
  subscriptions: Subscription[] = [];
  monaco: any;
  option: monacoNameSpace.editor.IEditorConstructionOptions = {
    automaticLayout: true
  };  

  private fsm = new TypeState.FiniteStateMachine<EditorMode>(EditorMode.None);

  private initFsm(){
    this.fsm.fromAny(EditorMode).toAny(EditorMode);
    this.fsm.onExit(EditorMode.Diff, (to: EditorMode) => {
      this.removeContent(this.diffTargetPath);
      return true;
    });
    this.fsm.onExit(EditorMode.Md, (to: EditorMode) => {
      this.markdownEditor.setContent('preview', '');
      // this.markdown = '';
      return true;
    });
  }

  private set _isDiffOn(diff: boolean) {
    if(diff)
      this.fsm.go(EditorMode.Diff);
    else
      this.fsm.go(EditorMode.None);
  }

  private get _isDiffOn(){
    return this.fsm.currentState == EditorMode.Diff
  }

  get isDiffOn(){
    return this._isDiffOn;
  }

  private set _isMdOn(md: boolean) {
    if(md)
      this.fsm.go(EditorMode.Md);
    else
      this.fsm.go(EditorMode.None);
  }

  private get _isMdOn(){
    return this.fsm.currentState == EditorMode.Md
  }

  get isMdOn(){
    return this._isMdOn;
  }
  
  get isNone(){
    return this.fsm.currentState == EditorMode.None;
  }

  constructor(private monacoService: MonacoService, private deviceService: DeviceDetectorService, private dispatcher: UserActionDispatcher) {  
    this.initFsm();
  }

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
    this.subscriptions.push(this.monacoService.monaco.subscribe((monaco) => {
      console.log("monacoService loaded");
      this.monaco = monaco;
      this.createMonacoEditor(monaco);
    }));
    this.subscriptions.push(this.notifyContentChangeSubject.pipe(
      debounceTime(2000)
    ).subscribe((path) => {
      new NotifyContentChangeAction(path, this, this.dispatcher).start();
    }));
  }

  load(pack: WorkspacePack) {
    pack.editorPacks.forEach((v) => {
      let content;
      let type = TextUtil.getFileType(v.path);
      if (type == FileType.Text) {
        content = TextUtil.base64ToString(v.base64);
      } else {
        content = v.base64;
      }
      this.setContent(v.path, content);
    });
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
  // beforeHeight = 0;
  beforeWidth = 0;
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
      this.editor = monaco.editor.create(myDiv, this.option);
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
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  setContent(path: string, content: string) {
    if (this.monaco != undefined) {
      let existsModel: monacoNameSpace.editor.ITextModel = (path != undefined) ? this.monaco.editor.getModel(monacoNameSpace.Uri.file(path)) : path;
      if (existsModel){
        existsModel.setValue(content);
      }else {
        this.model = this.monaco.editor.createModel(content, '', monacoNameSpace.Uri.file(path));
        this.model.onDidChangeContent((e) => {
          this.notifyContentChangeSubject.next(path);
        })
      }
    }else
      this.throwWhenNotInitialized();
  }

  select(path: string): boolean {
    if (this.monaco != undefined) {
      this.fsm.go(EditorMode.None);

      let existsModel: monacoNameSpace.editor.ITextModel = (path != undefined) ? this.monaco.editor.getModel(monacoNameSpace.Uri.file(path)) : path;
      if (existsModel) {
        this.editor.setModel(existsModel);
        // this.modelChanged.emit(path);
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

  private getModel(path?: string): monacoNameSpace.editor.ITextModel {
    if (this.monaco != undefined) {
      if(path == undefined){
        let v = this.editor.getModel();
        return v;
      }else{
        const uri = monacoNameSpace.Uri.file(path)
        let m: monacoNameSpace.editor.ITextModel = this.monaco.editor.getModel(uri);
        if(m == undefined)
          return undefined
        else
          return m;
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

  diffWith(path: string, content: string, originalPath?: string){
    if (this._isDiffOn == false) {
      let targetModel= this.getModel(originalPath);
      this.diffTargetPath = prefix + path;
      let originalModel = this.monaco.editor.createModel(content, '', monacoNameSpace.Uri.file(this.diffTargetPath));
      this.diffEditor.setContent(originalModel, targetModel);
      this._isDiffOn = true;
    }
  }
  
  md(){
    if (this._isMdOn == false) {
      let targetModel= this.getModel();
      // this.markdown = targetModel.getValue();
      this.markdownEditor.setContent('preview', targetModel.getValue());
      this.markdownEditor.select('preview');
      if(!this.markdownEditor.isMdOn)
        setTimeout(() => this.markdownEditor.md(), 0);
      this._isMdOn = true;
    }
  }

  getPathList(){
    if (this.monaco != undefined) {
      let models: Array<monacoNameSpace.editor.ITextModel> = this.monaco.editor.getModels();
      return models.map(m => m.uri.path.substr(1));
    } else
      this.throwWhenNotInitialized();
  }

  clear(){
    if (this.monaco != undefined) {
      this.getPathList().forEach(path => {
        this.removeContent(path);
      });
    }else
      this.throwWhenNotInitialized();    
  }

  throwWhenNotInitialized(){
    throw new Error("A monaco is not initalized");
  }
}
