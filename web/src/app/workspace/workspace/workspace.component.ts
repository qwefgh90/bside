import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, AfterContentInit, ElementRef } from '@angular/core';
import { WrapperService } from 'src/app/github/wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject, Observable, combineLatest } from 'rxjs';
import { MatDrawer, MatSelectChange } from '@angular/material';
import { GithubTreeNode, NodeStateAction } from '../tree/github-tree-node';
import { MonacoService } from '../editor/monaco.service';
import { Editor } from '../editor/editor';
import { Blob } from 'src/app/github/type/blob';
import { toByteArray } from 'base64-js';
import { TextDecoder } from 'text-encoding';
import * as jschardet from 'jschardet';
import * as mime from 'mime';
import * as mimeDb from 'mime-db'
import { Content } from 'src/app/github/type/content';

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
  selectedContent: Content;
  mimeName: string;
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

  selectNode(node: GithubTreeNode) {
    this.selectedNode = node;
    if (this.selectedNode.type == 'blob') {
      if (this.selectedNode.state.filter((v) => v == NodeStateAction.Created).length > 0) {
        this.selectedContent = new Content();
        this.mimeName = mime.getType(node.name);
    
        if (this.editor1 != undefined) {
          if (!this.editor1.selectTabIfExists(this.selectedNode.path))
            this.editor1.setContent(this.selectedNode.path, this.base64Decode(this.selectedContent.content))
        }
      } else {
        this.wrapper.getContents(this.userId, this.repositoryName, this.selectedBranch.commit.sha, node.path).then(
          (content: Content) => {
            this.selectedContent = content;
            this.mimeName = mime.getType(node.name);
            let type = this.getFileType(this.selectedNode.name, this.selectedContent.content);

            if(type == FileType.Image){
              this.selectedFileType = FileType.Image;
            } else if (type == FileType.Text) {
              this.selectedFileType = FileType.Text;
              if (this.editor1 != undefined) {
                if (!this.editor1.selectTabIfExists(this.selectedNode.path)){
                  this.editor1.setContent(this.selectedNode.path, this.base64Decode(content.content))
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

  base64Decode(str: string) {
    let arr = str.split("\n").map(v => {
      return v;
    });

    let bytes = toByteArray(arr.join(''));
    let string = '';
    for (var i = 0; i < bytes.length; ++i) {
      string += String.fromCharCode(bytes[i]);
    }
    console.debug('encoding detected: ' + jschardet.detect(string).encoding);
    let encoding = jschardet.detect(string).encoding
    let decoder = new TextDecoder(encoding != null ? encoding : 'utf-8')
    return decoder.decode(bytes);
  }

  getFileType(name: string, blob: string){
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

  isImage(name: string){
    let exts = ['.jpg', '.jpeg', '.gif', '.png'];
    return exts.filter((ext) => {
      return name.endsWith(ext);
    }).length > 0;
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
