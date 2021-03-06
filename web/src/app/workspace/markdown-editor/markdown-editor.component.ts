import { Component, OnInit, AfterViewInit, AfterContentInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Editor } from '../editor/editor';
import { WorkspacePack } from '../workspace/workspace-pack';
import * as EasyMDE from 'easymde';
import { togglePreview } from 'easymde';
import { TextUtil, FileType } from '../text/text-util';
import { UserActionDispatcher } from '../core/action/user/user-action-dispatcher';
import { NotifyContentChangeAction } from '../core/action/user/notify-content-change-action';
import { Store } from '@ngrx/store';
import { notifyChangesInContent } from '../workspace.actions';


@Component({
  selector: 'app-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.css']
})
export class MarkdownEditorComponent implements Editor, OnInit, AfterContentInit {

  models: Map<string, string> = new Map<string, string>();
  current: {path: string, content: string} = {
    path: undefined,
    content: undefined
  };
  mde: EasyMDE;
  constructor(private store: Store) {
  }

  @Input("preview")
  preview: boolean = false;

  @ViewChild("md", { static: true })
  textArea: ElementRef;

  ngAfterContentInit(){
    let opt: any = {element: this.textArea.nativeElement,
      spellChecker: false,
      status: true,
      renderingConfig: {
        singleLineBreaks: true,
        codeSyntaxHighlighting: false,
      }
    }
    if(this.preview){
      opt.toolbar = false;
    }
    this.mde = new EasyMDE(opt);
      
    if (!this.preview) {
      this.mde.codemirror.on("change", () => {
        this.models.set(this.current.path, this.mde.value());
        this.store.dispatch(notifyChangesInContent({path: this.current.path}));
      });
    }
  }

  ngOnInit() {

  }

  load(pack: WorkspacePack) {
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
  }

  select(path: string): boolean {
    if(this.models.has(path)){
      this.current.path = path;
      this.current.content = this.models.get(path);
      setTimeout(() => this.mde.value(`${this.current.content}`), 0);
      return true;
    }
    return false;
  }
  /** 
   * replace a content in the model linked to a path if a path exists, otherwise set a content and a path together
   * @param path 
   * @param content 
   */
  setContent(path: string, content: string) {
    this.models.set(path, content);
    if(this.current.path == path){ // update the markdown editor
      this.select(path);
    }
  }
  /**
   * whether a path exists as a model linked to the path
   * @param path 
   */
  exist(path: string): boolean {
    return this.models.has(path);
  }
  /**
   * return a content if path is not null
   * @param path 
   */
  getContent(path?: string): string {
    if(this.models.has(path)){
      return this.models.get(path);
    }else
      return this.models.get(this.current.path);
  }
  /**
   * remove a model linked to a path
   * @param path 
   */
  removeContent(path: string): boolean {
    return this.models.delete(path);
  }
  diffWith(path: string, content: string, originalPath?: string) {
  }

  /**
   * go to markdown view
   */
  md(on: boolean) {
    if(on && !this.isMdOn)
      togglePreview(this.mde);
    else if(!on && this.isMdOn)
      togglePreview(this.mde);
  }
  /**
   * get a path list
   */
  getPathList(): Array<string> {
    return Array.from(this.models.keys());
  }
  /**
   * change and get readonly mode of the editor
   */
  private _readonly: boolean;
  set readonly(v: boolean){
    // this._readOnly = this.mde.codemirror.isReadOnly();
    this._readonly = v;
    this.mde.codemirror.setOption("readOnly", v)
  }
  get readonly(){
    return this._readonly;
  }
  /**
   * force a editor to resize by shrinking and expanding
   */
  shrinkExpand() {} //it isn't needed

  /**
   * return whether editor is diff view
   */
  get isDiffOn(): boolean {
    return false
  }

  /**
   * return whether editor is md view
   */
  get isMdOn(): boolean {        
    return this.mde.isPreviewActive();
  }

  clear(){
    this.getPathList().forEach(path => {
      this.removeContent(path);
    });
  }
}
