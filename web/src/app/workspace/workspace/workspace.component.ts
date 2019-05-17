import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, AfterContentInit, ElementRef } from '@angular/core';
import { WrapperService } from 'src/app/github/wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject, Observable, combineLatest } from 'rxjs';
import { MatDrawer, MatSelectChange } from '@angular/material';
import { GithubTreeNode, NodeStateAction } from '../tree/github-tree-node';
import { MonacoService } from '../editor/monaco.service';
import { Editor } from '../editor/editor';
import { toByteArray } from 'base64-js';
import * as jschardet from 'jschardet';
import { TextDecoderLite } from 'text-encoder-lite';
import * as mime from 'mime';
import * as mimeDb from 'mime-db'
import { Content } from 'src/app/github/type/content';
import { Blob } from 'src/app/github/type/blob';

declare const monaco;

export enum FileType{
  Image, Text, Other, None
}

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit, OnDestroy, AfterContentInit {
  FileType = FileType;
  constructor(private wrapper: WrapperService, private monacoService: MonacoService, private route: ActivatedRoute, private router: Router) { 
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
  selectedBlob: Blob;
  mimeName: string;
  encoding: string;
  selectedFileType: FileType = FileType.None;

  initialized = false;

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
        this.initialzeWorkspace(this.userId, this.repositoryName, branchName).then(() => { });
      }
    }
    let s = combineLatest(this.route.paramMap, this.route.queryParamMap).subscribe(([p, q]) => {
      const branchName = this.route.snapshot.queryParams['branch'];
      if (p.has('userId') && p.has('repositoryName')) {
        this.userId = p.get('userId');
        this.repositoryName = p.get('repositoryName');
        this.initialzeWorkspace(this.userId, this.repositoryName, branchName).then(() => {});
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

  getRawUrl(blob: Blob): string{
    return `https://raw.githubusercontent.com/${this.repositoryDetails.full_name}/${this.selectedBranch.commit.sha}/${this.selectedNode.path}`;
  }

  selectNode(node: GithubTreeNode) {
    this.selectedNode = node;
    if (this.selectedNode.type == 'blob') {
      if (this.selectedNode.state.filter((v) => v == NodeStateAction.Created).length > 0) {
        this.selectedBlob = new Blob();
        let bytes = this.base64ToBytes('');
        this.mimeName = mime.getType(node.name);
        this.encoding = 'utf-8';
        this.selectedFileType = FileType.Text;
    
        if (this.editor1 != undefined) {
          if (!this.editor1.selectTabIfExists(this.selectedNode.path))
            this.editor1.setContent(this.selectedNode.path, this.decode(bytes, this.encoding))
        }
      } else {
        this.wrapper.getBlob(this.userId, this.repositoryName, this.selectedNode.sha).then(//getContents(this.userId, this.repositoryName, this.selectedBranch.commit.sha, node.path).then(
          (blob: Blob) => {
            this.selectedBlob = blob;
            let bytes = this.base64ToBytes(blob.content);
            let type = this.getFileType(this.selectedNode.name);
            this.mimeName = mime.getType(node.name);
            this.encoding = this.getEncoding(bytes)

            if(type == FileType.Image){
              this.selectedFileType = FileType.Image;
            } else if (type == FileType.Text) {
              this.selectedFileType = FileType.Text;
              if (this.editor1 != undefined) {
                if (!this.editor1.selectTabIfExists(this.selectedNode.path)){
                  this.editor1.setContent(this.selectedNode.path, this.decode(bytes, this.encoding))
                }
              }
            }else{
              this.selectedFileType = FileType.Other;
            }
          }, (reason) => {
            console.debug("An error during getting blob. Maybe selectedNode is invalid.");
            console.debug(this.selectedNode);
          });
      }
    }
  }

  nodeCreated(node: GithubTreeNode){

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
    jschardet.enableDebug();
    let encoding = jschardet.detect(string).encoding;
    console.debug('detected encoding: ' + encoding);
    return encoding;
  }

  getFileType(name: string){
    const mimeName: string = mime.getType(name);
    const mimeInfo = mimeDb[mime.getType(name)]
    let compressible = (mimeInfo != undefined) && (mimeInfo.compressible != undefined) ? mimeInfo.compressible : true; // unknown is considered as compressible
    console.debug(mime.getType(name));
    console.debug(mimeInfo);
    console.debug(compressible);
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
      console.error("Default branch can't be loaded.")
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
    const branch = event.value;
    this.router.navigate([], {queryParams: {branch: branch.name}})
  }
 
}
