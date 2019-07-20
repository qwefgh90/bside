import { Component, OnInit, Inject, ViewChildren, ViewChild, AfterContentInit, AfterViewInit } from '@angular/core';
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
export class ForkComponent implements OnInit, AfterContentInit {

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
        this.firstFormGroup.get('newNameCtrl').setValue(this.recommendedName);
        this.loading = false;
      }, () => {
        this.firstFormGroup.get('newNameCtrl').setValue(this.recommendedName);
        this.loading = false;
      })
    }, (reason) => {
      console.info("please sign in " + reason);
    });
    
  }

  ngAfterContentInit(){ 
    this.stepper.selectionChange.subscribe((v) => {
      if (v.selectedIndex == 0) {
        let isUserPage = this.isUserPageName(this.firstFormGroup.get('newNameCtrl').value);
        if (isUserPage)
          this.secondFormGroup.get('branchCtrl').setValue("master");
        else {
          this.secondFormGroup.get('branchCtrl').setValue(undefined);
          this.secondFormGroup.get('branchCtrl').markAsUntouched;
        }
      }
    })
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

  async clone(){
    this.btnOpts.active = true;
    this.btnOpts.text = 'Cloning'
    this.wrapper.fork(this.data.owner, this.data.repoName).then((v) => {
      let owner = v.owner.login;
      let oldName = v.name;
      let newName = this.firstFormGroup.get('newNameCtrl').value;
      let timeout = setInterval(() => {
        this.btnOpts.text = 'Checking'
        this.wrapper.repositories(v.owner.login).then(repos => {
          let idx = repos.findIndex((v) => 
            v.name == oldName
          );
          if(idx != -1){
            console.log(`fork() is successful. ${timeout} is stopped.`);
            clearTimeout(timeout);
              this.btnOpts.text = 'Renaming'
              this.wrapper.rename(owner, oldName, newName).then((v) => {
                console.log("rename() is successful.");
                this.htmlUrl = v.html_url;
                this.btnOpts.text = 'Updating page'
                let pageInfo = this.wrapper.getPageBranch(owner, newName);
                pageInfo.then((info) => {
                  let branchChange;
                  if(info == undefined){
                    branchChange = this.wrapper.createPageBranch(owner, newName, this.secondFormGroup.get('branchCtrl').value).then(() => {
                      this.result = v;
                      console.log("createPageBranch() is successful.");
                    });
                  }else{
                    branchChange = this.wrapper.updatePageBranch(owner, newName, this.secondFormGroup.get('branchCtrl').value).then(() => {
                      this.result = v;
                      console.log("setPageBranch() is successful.");
                    });
                  }
                  this.btnOpts.text = 'Building page'
                  setTimeout(() => {
                    let build1 = branchChange.then(() => {
                      this.wrapper.buildPage(owner, newName).then(() => {
                        // this.complete = true;
                        console.log("It requests to build the page at first time.");
                      });
                    });
                    let build2 = branchChange.then(() => {
                      this.wrapper.buildPage(owner, newName).then(() => {
                        // this.complete = true;
                        console.log("It requests to build the page at second time.");
                      });
                    });
                    let build3 = branchChange.then(() => {
                      this.wrapper.buildPage(owner, newName).then(() => {
                        // this.complete = true;
                        console.log("It requests to build the page at third time.");
                      });
                    });
                    Promise.all([build1, build2, build3]).then(()=> {
                      let timeoutForCheckingBuild = setInterval( () => {
                        this.wrapper.buildStatus(owner, newName).then((v) => {
                          if (v.length > 0) {
                            if (v[0].status == 'built') {
                              clearTimeout(timeoutForCheckingBuild);
                              this.complete = true;
                            }
                          }
                        }, () => {
                          clearTimeout(timeoutForCheckingBuild);
                        })
                      }, 2000);
                    });
                  }, 3000);
                })
              });
          }
        })
      }, 5000);
    });
  }

  
  get recommendedName(): string {
    let oldName = this.data.repoName;
    if(oldName.endsWith(".github.io") || oldName.endsWith(".github.com")){
      return `${this.loginUserName}.github.io`;
    }else
      return oldName;
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

}
