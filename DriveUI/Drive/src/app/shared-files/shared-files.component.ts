import { Component, OnInit } from '@angular/core';
import { UserdataService } from '../userdata.service';
import { FileModel } from '../file-model';
import { ApicallsService } from '../apicalls.service';

@Component({
  selector: 'app-shared-files',
  templateUrl: './shared-files.component.html',
  styleUrl: './shared-files.component.css'
})
export class SharedFilesComponent implements OnInit{
  sharefiles:any[] = [];
  selectedFile: FileModel | null = null; 
  fileToView: FileModel | null = null;
  username:string=localStorage.getItem('username') ?? "" ;
  constructor(private us: UserdataService,private as:ApicallsService){}
  ngOnInit(): void 
  {
    this.getSharedFiles();
  }
  onFileClick(file: FileModel): void 
  {
    this.selectedFile = file;
  }
  onFileDoubleClick(file: FileModel): void 
  {
    this.fileToView = file;
  }
  getSharedFiles()
  {
    this.as.sharedfile(this.username).subscribe(
      (files: FileModel[]) => {
        this.sharefiles = files;
      },
      (error) => {
        if (error.status === 404) {
          this.sharefiles = [];
          console.log('Files not found');
        }
      }
    );
  }

  onFileClicks(file: any): void {
    this.selectedFile = this.selectedFile === file ? null : file;
  }
  
  onCheckboxChange(event: Event, file: any): void {
    this.selectedFile = (event.target as HTMLInputElement).checked ? file : null;
  }
}
