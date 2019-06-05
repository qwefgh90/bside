import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Upload } from './upload';
import { UploadFile } from './upload-file';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit, Upload {
  @ViewChild("file")
  fileInput: ElementRef<HTMLInputElement>;
  @Output("fileToUpload")
  fileToUpload = new EventEmitter<UploadFile>()
  parentPath: string;

  constructor() { }

  ngOnInit() {

  }

  select(parentPath: string){
    this.parentPath = parentPath;
    this.fileInput.nativeElement.click();
  }

  handleFiles(event: Event) {
    const parentPath = this.parentPath;
    const files = ((event.target) as HTMLInputElement).files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.debug(`select ${file.name}`);
      const reader = new FileReader();      
      reader.onload = () => {
        const base64 = reader.result.toString().replace(/data:.*base64,/,'');
        const f = new UploadFile(parentPath, file.name, file.type, file.size, base64);
        console.debug(f);
        this.fileToUpload.emit(f);
        this.parentPath = undefined;
      };
      reader.onerror = (error) => {
        console.debug('Error: ', error);
        this.parentPath = undefined;
      };
      reader.readAsDataURL(file);
    }
  }
}
