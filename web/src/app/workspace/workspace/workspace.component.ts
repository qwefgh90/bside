import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, AfterContentInit, ElementRef } from '@angular/core';
import { WrapperService } from 'src/app/github/wrapper.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { MatDrawer } from '@angular/material';
import { GithubTreeNode } from '../tree/github-tree-node';
import { MonacoService } from '../editor/monaco.service';
import { Editor } from '../editor/editor';
import { Blob } from 'src/app/github/type/blob';

declare const monaco;

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit, OnDestroy, AfterContentInit {
  
  constructor(private wrapper: WrapperService, private monacoService: MonacoService, private route: ActivatedRoute) { 
  }

  @ViewChild("editor1") editor1: Editor;

  userId;
  repositoryName;
  repositoryDetails;
  branches: Array<any>;
  selectedBranch;
  tree: any

  selectedNode: GithubTreeNode;
  selectedBlob: Blob
  subscribe: Subscription;

  @ViewChild("leftDrawer") leftPane: MatDrawer;
  @ViewChild("rightDrawer") rightPane: MatDrawer;

  ngOnInit() {
    this.subscribe = this.route.paramMap.subscribe((p) => {
      if (p.has('userId') && p.has('repositoryName')) {
        this.userId = p.get('userId');
        this.repositoryName = p.get('repositoryName');
        this.initialzeWorkspace(this.userId, this.repositoryName);
      }
    });
    this.initalizeLoader();
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
    this.subscribe.unsubscribe();
  }

  toggle() {
    this.leftPane.toggle();
    this.rightPane.toggle();
  }

  selectNode(node: GithubTreeNode) {
    this.selectedNode = node;
    this.wrapper.blob(this.userId, this.repositoryName, this.selectedNode.sha).then(
      (blob: Blob) => {
        this.selectedBlob = blob;
        
        if(this.editor1 != undefined){
          if(!this.editor1.selectTabIfExists(this.selectedNode.path))
            this.editor1.setContent(this.selectedNode.path, this.b64DecodeUnicode(blob.content))
        }
      }
    ,(reason) => {
      console.debug("An error during getting blob. Maybe selectedNode is a type of tree. ");
      console.debug(this.selectedNode);
    });
  }
  
  //https://developer.mozilla.org/ko/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
  b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }


  async initialzeWorkspace(userId, repositoryName): Promise<void> {
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
 
 
}
