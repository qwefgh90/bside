import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, AfterContentInit, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { WrapperService } from 'src/app/github/wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject, Observable, combineLatest, fromEventPattern } from 'rxjs';
import { MatDrawer, MatSelectChange } from '@angular/material';
import { GithubTreeNode, NodeStateAction } from '../tree/github-tree-node';
import { MonacoService } from '../editor/monaco.service';
import { Editor } from '../editor/editor';
import { toByteArray } from 'base64-js';
import * as jschardet from 'jschardet';
import { TextDecoderLite } from 'text-encoder-lite';
import * as mime from 'mime';
import * as mimeDb from 'mime-db'
import { Blob } from 'src/app/github/type/blob';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare const monaco;

export enum FileType{
  Image, Text, Other
}

export enum TreeStatus{
  Loading, NotInitialized, Done, Fail
}

export enum ContentStatus{
  Loading, NotInitialized, Done, Fail
}

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit, OnDestroy, AfterContentInit {
  FileType = FileType;
  TreeStatus = TreeStatus;
  ContentStatus = ContentStatus;
  constructor(private wrapper: WrapperService, private monacoService: MonacoService, private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer) { 
    console.log("new comp");
  }

  @ViewChild("editor1") editor1: Editor;

  userId;
  repositoryName;
  repositoryDetails;
  branches: Array<any>;
  selectedBranch;
  tree: any

  selectedNode: GithubTreeNode;
  mimeName: string;
  encoding: string;
  selectedFileType: FileType;
  selectedImagePath: SafeResourceUrl;

  initialized = false;
  contentStatus: ContentStatus = ContentStatus.NotInitialized;
  treeStatus: TreeStatus = TreeStatus.NotInitialized;

  subscriptions: Array<Subscription> = []

  @ViewChild("leftDrawer") leftPane: MatDrawer;
  @ViewChild("rightDrawer") rightPane: MatDrawer;

  ngOnInit() {
    this.initalizeLoader();
    if(this.route.snapshot.queryParams['branch'] == undefined){
      const userId = this.route.snapshot.params['userId']
      const repositoryName = this.route.snapshot.params['repositoryName']
      const branchName = this.route.snapshot.queryParams['branch']
      if(userId != undefined && repositoryName != undefined){
        this.userId = userId;
        this.repositoryName = repositoryName;
        this.initialzeWorkspace(this.userId, this.repositoryName, branchName).finally(() => {
          this.treeStatus = TreeStatus.Done;
        })
      }else
        this.treeStatus = TreeStatus.Fail;
    }else
      this.treeStatus = TreeStatus.Fail;
    let s = combineLatest(this.route.paramMap, this.route.queryParamMap).subscribe(([p, q]) => {
      const branchName = this.route.snapshot.queryParams['branch'];
      if (p.has('userId') && p.has('repositoryName')) {
        this.userId = p.get('userId');
        this.repositoryName = p.get('repositoryName');
        this.initialzeWorkspace(this.userId, this.repositoryName, branchName).finally(() => { 
          this.treeStatus = TreeStatus.Done;
        });
      }else{
        this.treeStatus = TreeStatus.Fail;
      }
    });
    this.subscriptions.push(s);
  }

  private initalizeLoader(){
    if (!(window as any).require) {
      const loaderScript = document.createElement("script");
      loaderScript.type = "text/javascript";
      loaderScript.src = "vs/loader.js";
      loaderScript.addEventListener("load", () => {
        (window as any).require(["vs/editor/editor.main"], () => {
          this.monacoService.monaco.next(monaco);
        });
      });
      document.body.appendChild(loaderScript);
    }
  }

  ngAfterContentInit() {
    this.toggle();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscribe =>
      subscribe.unsubscribe());
  }

  toggle() {
    this.leftPane.toggle();
    this.rightPane.toggle();
  }

  newNode(node: GithubTreeNode){

  }

  getImage(base64: string, mediaType: string): SafeResourceUrl{
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:${mediaType};base64,${base64}`);
    // return `https://raw.githubusercontent.com/${this.repositoryDetails.full_name}/${this.selectedBranch.commit.sha}/${this.selectedNode.path}`;
  }

  nodeSelected(node: GithubTreeNode) {
    if (node.type == 'blob') {
      this.selectedNode = node;
      this.contentStatus = ContentStatus.Loading;
      this.mimeName = mime.getType(node.name);
      let type = this.getFileType(this.selectedNode.name);
      this.selectedFileType = type;
      if (this.selectedNode.state.filter((v) => v == NodeStateAction.Created).length > 0) {
        if (type == FileType.Text) {
          let bytes = this.base64ToBytes('');
          this.encoding = 'utf-8';
          this.setContentAndFocusInEditor(this.selectedNode.path, bytes, this.encoding);
        }
        this.contentStatus = ContentStatus.Done;
      } else {
        this.wrapper.getBlob(this.userId, this.repositoryName, this.selectedNode.sha).then(
          (blob: Blob) => {
            if(type == FileType.Image){
              console.log('mimeName: '+ this.mimeName)
              this.selectedImagePath = this.getImage(blob.content, this.mimeName);
            } else if (type == FileType.Text) {
              let bytes = this.base64ToBytes(blob.content);
              this.encoding = this.getEncoding(bytes)
              this.setContentAndFocusInEditor(this.selectedNode.path, bytes, this.encoding);
            }
          }, (reason) => {
            console.debug("An error during getting blob. Maybe selectedNode is invalid.");
            console.debug(this.selectedNode);
          }
        ).finally(() => {
          this.contentStatus = ContentStatus.Done;
        });
      }
    }
  }

  private setContentAndFocusInEditor(path: string, bytes: any, encoding: string){
    if (this.editor1 != undefined) {
      if (this.editor1.exist(path))
        this.editor1.selectTab(path);
      else{
        this.editor1.setContent(path, this.decode(bytes, encoding))
        this.editor1.selectTab(path);
      }
    }
  }

  nodeCreated(node: GithubTreeNode){ }

  nodeRemoved(node: GithubTreeNode){
    this.editor1.removeContent(node.path);
  }

  nodeMoved(e: {fromPath: string, to: GithubTreeNode}){
    if(e.to.type == 'blob' && this.editor1.exist(e.fromPath)){
      let content = this.editor1.getContent(e.fromPath);
      this.editor1.removeContent(e.fromPath);
      this.editor1.setContent(e.to.path, content);
    }
  }

  decode(bytes, encoding: string) {
    let decoder = new (TextDecoderLite == undefined ? TextDecoder : TextDecoderLite)(encoding != null ? encoding.toLowerCase() : 'utf-8')
    let result = decoder.decode(bytes);
    return result;
  }

  base64ToBytes(str: string) {
    let arr = str.split("\n").map(v => {
      return v;
    });

    let bytes = toByteArray(arr.join(''));
    return bytes;
  }

  getEncoding(bytes): string {
    let string = '';
    for (var i = 0; i < bytes.length; ++i) {
      string += String.fromCharCode(bytes[i]);
    }
    let encoding = jschardet.detect(string).encoding;
    console.debug('detected encoding: ' + encoding);
    return encoding;
  }

  getFileType(name: string){
    const mimeName: string = mime.getType(name);
    const mimeInfo = mimeDb[mime.getType(name)]
    let compressible = (mimeInfo != undefined) && (mimeInfo.compressible != undefined) ? mimeInfo.compressible : true; // unknown is considered as compressible
    console.debug(`mimeInfo ${mimeInfo}`);
    console.debug(`compressible: ${compressible}`);
    if(mimeName != null && mimeName.toLocaleLowerCase().startsWith('image/'))
      return FileType.Image;
    else if((mimeName != null && mimeName.toLocaleLowerCase().startsWith('text/') || compressible)){
      return FileType.Text
    } else{
      return FileType.Other
    }
  }

  async initialzeWorkspace(userId, repositoryName, branchName?: string): Promise<void> {
    let details = this.wrapper.repositoryDetails(userId, repositoryName).then((result) => {
      this.repositoryDetails = result;
    }, () => {
      console.error("Repository can't be loaded.")
    });

    let branches = this.wrapper.branches(userId, repositoryName).then((result) => {
      this.branches = result;
    }, () => {
      console.error("Branches can't be loaded.")
    });

    let defaultBranch = Promise.all([details, branches]).then(() => {
      const defaultBranchName = this.repositoryDetails.default_branch;
      if(branchName)
        this.setBranchByName(branchName);
      else
        this.setBranchByName(defaultBranchName);
    }, () => {
      console.error("Default branch can't be loaded.");
    });

    await defaultBranch;

    return this.setTree().then((v) => { },
      () => {
        console.error("Tree can't be loaded.")
      }
    );
  }

  setTree(): Promise<void> {
    const tree = this.wrapper.tree(this.userId, this.repositoryName, this.selectedBranch.commit.sha);
    return tree.then(tree => {
      this.tree = tree;
    });
  }

  setBranchByName(branchName: string): void {
    const branch = this.branches.find((v) => {
      if (v.name == branchName) {
        return true;
      } return false;
    });
    this.selectedBranch = branch;
  }

  onBranchChange(event: MatSelectChange){
    this.treeStatus = TreeStatus.Loading;
    const branch = event.value;
    this.router.navigate([], {queryParams: {branch: branch.name}})
  }
 
}
