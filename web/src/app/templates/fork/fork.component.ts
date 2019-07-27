import { Component, OnInit, Inject, ViewChildren, ViewChild, AfterContentInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { Validators, FormBuilder, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { WrapperService } from 'src/app/github/wrapper.service';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

export interface ForkData {
  owner: string;
  repoName: string;
  htmlUrl: string;
  cloneRepo: any;
}
@Component({
  selector: 'app-fork',
  templateUrl: './fork.component.html',
  styleUrls: ['./fork.component.css']
})
export class ForkComponent implements OnInit, AfterContentInit, OnDestroy {

  newName: string;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  repositories: Array<any>;
  branches: Array<any>;
  loginUserName: string;
  namePattern: RegExp = /^[\w\-\.]+$/;
  alreadyFork = false;
  loading = true;
  complete = false;
  failure = false;
  selectedBranch = 'master';
  result: any;
  htmlUrl: string;
  recommendedName: string;
  recommendedBranch: string;
  

  @ViewChild(MatStepper)
  stepper: MatStepper;

  constructor(
    private dialogRef: MatDialogRef<ForkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ForkData, private _formBuilder: FormBuilder, 
    private wrapper: WrapperService) { }

  ok(){
    this.dialogRef.close({repo: this.result, pageBranch: this.secondFormGroup.get('branchCtrl').value});
  }

  isUserPageName(repositoryName: string){
    return `${this.loginUserName}.github.io` == repositoryName
      || `${this.loginUserName}.github.com` == repositoryName;
  }

  getProjectPageUrl(){
    return `https://${this.loginUserName}.github.io/${this.firstFormGroup.get('newNameCtrl').value}/`
  }
  
  getUserPageUrl(){
    return `https://${this.loginUserName}.github.io/`
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
        newNameCtrl: ['', [Validators.required, (control: FormGroup): ValidationErrors | null => {
          return this.exist(control.value) ? { 'duplicate': true } : null;
        }, (control: FormGroup): ValidationErrors | null => {
          return this.exist(this.data.repoName) ? { 'duplicate_reponame': true } : null;
        }, (control: FormGroup): ValidationErrors | null => {
          return (control.value.match(this.namePattern) == null) ? { 'invalid_pattern': true } : null;
        }],
      ]
    });
    this.secondFormGroup = this._formBuilder.group({
      branchCtrl: ['', [Validators.required]]
    });

    this.wrapper.user().then(u => {
      this.loginUserName = u.login;
      let repos = this.wrapper.repositories(u.login).then((result) => {
        this.repositories = result;
      }, () => {
        console.error("Repositories can't be loaded.")
      });
      let branches = this.wrapper.branches(this.data.owner, this.data.repoName).then((arr: any[]) => {
        this.branches = arr.filter((b) => b.name == 'master' || b.name == 'gh-pages');
        this.initBranch();
      }, () => {
        console.error("Branches can't be loaded.")
      })
      let alreadyForkPromise = this.wrapper.forkList(this.data.owner,this.data.repoName).then((list) => {
        let idx = list.findIndex((v) => v.owner.login == u.login)
        if (idx != -1) {
          console.log(`${this.data.repoName} is already cloned.`);
          this.alreadyFork = true;
        }
      }, (res) => {
        }
      )
      Promise.all([repos, branches, alreadyForkPromise]).then(() => {
        this._recommendedName().then((name) => {
          this.firstFormGroup.get('newNameCtrl').setValue(name);
          this.loading = false;
          this.recommendedName = name;
        })
      }, () => {
        this._recommendedName().then((name) => {
          this.firstFormGroup.get('newNameCtrl').setValue(name);
          this.loading = false;
          this.recommendedName = name;
        })
      })
    }, (reason) => {
      console.info("please sign in " + reason);
    });
  }

  initBranch(){
    let isUserPage = this.isUserPageName(this.firstFormGroup.get('newNameCtrl').value);
    this._recommendedBranch().then((b) => {
      this.recommendedBranch = b;
      if(b == 'master' || isUserPage){
        this.secondFormGroup.get('branchCtrl').setValue("master");
      }else{
        this.secondFormGroup.get('branchCtrl').setValue(undefined);
        this.secondFormGroup.get('branchCtrl').markAsUntouched;
      }
    });

  }

  ngAfterContentInit(){
    this.stepper.selectionChange.subscribe((v) => {
      if (v.selectedIndex == 0) {
        this.initBranch();
      }
    });
  }

  exist(name: string){
    if(this.repositories == undefined){
      console.warn('Repositories are not being loaded. It may have some problems.')
      return true;
    }
    let idx = this.repositories.findIndex(repo => repo.name.toLowerCase() == name.toLowerCase());
    if(idx != -1)
      return true;
    else
      return false;
  }

  async clone() {
    this.btnOpts.active = true;
    this.btnOpts.text = 'Cloning'
    let v = await this.wrapper.fork(this.data.owner, this.data.repoName)
    let owner = v.owner.login;
    let oldName = v.name;
    let newName = this.firstFormGroup.get('newNameCtrl').value;
    let intervalForCheckingBuild;
    let intervalOfCreating;
    let countOfCheckingCreating = 0;
    intervalOfCreating = setInterval(async () => {
      try {
        this.btnOpts.text = 'Checking'
        let repos = await this.wrapper.repositories(v.owner.login);
        let idx = repos.findIndex((v) =>
          v.name == oldName
        );
        if (idx != -1) {
          console.log(`fork() is successful. ${intervalOfCreating} is stopped.`);
          clearTimeout(intervalOfCreating);
          this.btnOpts.text = 'Renaming'
          await this.wrapper.rename(owner, oldName, newName);
          console.log("rename() is successful.");
          this.htmlUrl = v.html_url;
          this.btnOpts.text = 'Updating page'
          let info = await this.wrapper.getPageBranch(owner, newName);
          let branchChange;
          if (info == undefined) {
            await this.wrapper.createPageBranch(owner, newName, this.secondFormGroup.get('branchCtrl').value)
            this.result = v;
            console.log("createPageBranch() is successful.");
          } else {
            await this.wrapper.updatePageBranch(owner, newName, this.secondFormGroup.get('branchCtrl').value)
            this.result = v;
            console.log("setPageBranch() is successful.");
          }
          this.btnOpts.text = 'Building page'
          let countOfCheckingBuild = 0;
          await setTimeout(async () => { }, 3000);
          await this.wrapper.buildPage(owner, newName);
          // this.complete = true;
          console.log("It requests to build the page at first time.");
          intervalForCheckingBuild = setInterval(async () => {
            try {
              let buildStatus = await this.wrapper.buildStatus(owner, newName)
              if (buildStatus.length > 0) {
                if (buildStatus[0].status == 'built') {
                  clearTimeout(intervalForCheckingBuild);
                  this.complete = true;
                } else if (buildStatus[0].status == 'errored') {
                  clearTimeout(intervalForCheckingBuild);
                  this.complete = true;
                }
              }
              if (countOfCheckingBuild >= 10) {
                clearTimeout(intervalForCheckingBuild);
              }
              countOfCheckingBuild++;
            } catch (e) {
              console.error(e);
              if (intervalForCheckingBuild != undefined) {
                clearInterval(intervalForCheckingBuild);
              }
            }
          }, 2000);
        }
        if (countOfCheckingCreating >= 10) {
          clearTimeout(countOfCheckingCreating);
        }
        countOfCheckingCreating++;

      } catch (e) {
        console.error(e);
        if (intervalOfCreating != undefined) {
          clearInterval(intervalOfCreating);
        }
      }
    }, 5000);
  }

  /**
   * precedence
   * 1) user page if repo name ends with github.io
   * 2) user page if recommened branch is master
   * 3) project page with old name
   */
  async _recommendedName(): Promise<string> {
    let oldName = this.data.repoName;
    let branch = await this._recommendedBranch();

    if(oldName.endsWith(".github.io") 
      || oldName.endsWith(".github.com")){
      return Promise.resolve(`${this.loginUserName}.github.io`);
    }else
      return Promise.resolve(oldName);
  }

  /**
   * precedence
   * 1) the branch which is selected for page
   * 2) master branch if master exists alone
   * 3) none
   */
  async _recommendedBranch(): Promise<string>{
    let master = this.branches.find((b) => b.name.toLowerCase() == 'master')
    let ghPage = this.branches.find((b) => b.name.toLowerCase() == 'gh-pages')
    let pageBranch = await this.wrapper.getPageBranch(this.data.owner, this.data.repoName);
    if(pageBranch != undefined){
      return Promise.resolve(pageBranch.source.branch);
    }else if(master != undefined && ghPage == undefined){
      return Promise.resolve('master');
    }else
      return Promise.resolve(undefined);
  }

  // Button Options
  btnOpts: MatProgressButtonOptions = {
    active: false,
    text: 'Clone',
    spinnerSize: 19,
    raised: false,
    stroked: true,
    flat: false,
    fab: false,
    buttonColor: 'primary',
    spinnerColor: 'primary',
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
  };

  ngOnDestroy(){

  }
}
