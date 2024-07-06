import { Component, OnInit } from '@angular/core';
import { FileModel } from '../file-model';
import { UserdataService } from '../userdata.service';
import { ApicallsService } from '../apicalls.service';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrl: './trash.component.css'
})
export class TrashComponent implements OnInit{
 trashfiles:FileModel[]=[];
 receiverUsername: string = 'user5';
  selectedFile: FileModel | null = null; 
fileToView: FileModel | null = null;
username:string=localStorage.getItem('username') ?? "" ;
 constructor(private us:UserdataService,private as:ApicallsService){}
 ngOnInit(): void {
   this.loadtrashfiles();
  }
  gettrashfiles()
  {
  }
  onFileClick(file: FileModel): void {
    this.selectedFile = this.selectedFile === file ? null : file;
  }
  onFileDoubleClick(file: FileModel): void {
    this.fileToView = file;
  }


  loadtrashfiles():void
  {
    this.as.trashfiles(this.username).subscribe(
      (files: FileModel[]) => {
        this.trashfiles = files;
      },
      (error) => {
        if (error.status === 404) {
          this.trashfiles= [];
          console.log('Files not found');
        }
      }
    );
  }

  restore(file:FileModel) {
    if (file) {
      this.as.RestoreFiles(this.username, file.fileName).subscribe(
        (response: any) => {
          console.log("response from the server is ", response);
          this.loadtrashfiles();
          alert("file is moved to drive successfully")
        },
        (error: any) => {
          if (error.status === 404) {
            console.log("response error", error);
          }
        }
      );
    } else {
      console.log("No file selected to restore.");
    }
  }


onFileClicks(file: any): void {
  this.selectedFile = this.selectedFile === file ? null : file;
}

onCheckboxChange(event: Event, file: any): void {
  this.selectedFile = (event.target as HTMLInputElement).checked ? file : null;
}
deletefile(file:FileModel){
  if (file) {
    this.as.deletefile(this.username, file.fileName).subscribe(
      (response: any) => {
        console.log("response from the server is ", response);
        this.loadtrashfiles();
        alert("file deleted successfully");
      },
      (error: any) => {
        if (error.status === 404) {
          console.log("response error", error);
          alert("an error has occured while deleting the file");
        }
      }
    );
  } else {
    console.log("No file selected to restore.");
  }

}

}
