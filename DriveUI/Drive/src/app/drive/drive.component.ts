import { Component, OnInit } from '@angular/core';
import { FileModel } from '../file-model';
import { UserdataService } from '../userdata.service';
import { ApicallsService } from '../apicalls.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { response } from 'express';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { Foldermodel } from '../foldermodel';
import JSZip from 'jszip';
@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrl: './drive.component.css'
})
export class DriveComponent implements OnInit {
  files:FileModel[]=[];
  file: FileModel|null=null;
  foldernames:any;
  selectedFile: FileModel | null = null; 
  fileToView: FileModel | null = null;
  isShareModalOpen: boolean = false;
  recipientUsernames: string = '';
  fileName:string="";
  folder:Foldermodel|null=null;
  folderfiles:FileModel[]=[];
  username:string=localStorage.getItem('username') ?? "" ;
  uploadForm: FormGroup;
  filedata:any;
  upload:boolean=false;
  showfolder:boolean=false;
  downloadfiles:FileModel[]=[];
  foldername:string='';
  constructor(private fileService: UserdataService,private fb: FormBuilder,private as :ApicallsService,private http:HttpClient){
    this.uploadForm = this.fb.group({
      username: [''],
      filename: ['']
    });
  }
  ngOnInit(): void {
    this.loaddriveFiles();
    this.loadfoldernames();
  }
  openuploadfile()
 {
  this.upload=true;
 }
  closeuploadfile()
  {
  this.upload=false;
  }
 
  downloadFile(id: string): void {
    console.log('Downloading file with id:', id);
  }
  onFileClick(file: FileModel): void {
    this.selectedFile = file;
  }
  onFileDoubleClick(file: FileModel): void {
    this.fileToView = file;
  }
  onFolderDoubleClick(folder:string){
    this.foldername=folder;
    this.showfolderfiles(folder);
  }
  openShareModal() {
    if (this.selectedFile) {
      this.isShareModalOpen = true;
    }
  }
  closeShareModal() {
    this.isShareModalOpen = false;
    this.recipientUsernames = '';
  }

  
  loaddriveFiles()
  {
    this.as.getmydriveFiles(this.username).subscribe(
      (files: FileModel[]) => {
        this.files = files;
        console.log("drive files",files);
      },
      (error) => {
        if (error.status === 404) {
          this.files = [];
          console.log('Files not found');
        } 
      }
    );
  }
  loadfoldernames(){
    this.as.getfoldernames(this.username).subscribe(
      (response:any )=> {
        this.foldernames = response;
        console.log("drive files",response);
      },
      (error) => {
        if (error.status === 404) {
          this.foldernames ='';
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


  downloadFiles(file:FileModel): void {
    this.as.downloadfile(this.username, file.fileName).subscribe(
      (files: FileModel) => {
        this.file = files;
        this.filedownload(file);
        alert(`File '${file.fileName}' downloaded successfully!`);
      },
      (error) => {
        if (error.status === 404) {
         this.files = [];
         alert(`File '${file.fileName}' cannot be download`);
    } 
    }
    );
  }

filedownload(file:FileModel){
      // Decode Base64-encoded data if needed
      this.filedata=file.fileData
      const binaryString=atob(this.filedata);
  
      // Convert binary string to Uint8Array
      const arrayBuffer = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
          arrayBuffer[i] = binaryString.charCodeAt(i);
      }
  
      // Create Blob from ArrayBuffer
      const fileBlob = new Blob([arrayBuffer], { type: file.contentType });
  
      // Create object URL for the Blob
      const fileURL = URL.createObjectURL(fileBlob);
  
      // Create <a> element to trigger download
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = file.fileName;
      a.click();
  
      // Revoke the object URL to free up resources
      URL.revokeObjectURL(fileURL);
    }

  shareFile() {
    const shareData = {
      senderUsername:this.username,
      receiverUsernames: this.recipientUsernames.split(',').map(username => username.trim()),
      fileName: this.fileName 
    };
    this.as.fileshare(shareData).subscribe((response: any) => {
      console.log('File shared successfully:', response);
      alert(`File '${this.fileName}'shared to '${this.recipientUsernames}'successfully!`);
      this.closeShareModal();
    }, (error: any) => {
      alert(`File '${this.fileName}' cannot be shared`);
    });
  }

  onSubmit() {
    const username = this.uploadForm.get('username')?.value;
    const filename = this.uploadForm.get('filename')?.value;

    if (username && filename) {
      this.fileService.moveFile(username, filename).subscribe(
        () => {
          console.log('File move successful');
          // Handle success as needed
        },
        (error) => {
          console.error('File move failed', error);
          alert('File move failed');
          // Handle error as needed
        }
      );
    } else {
      alert('Please provide username and filename.');
    }
  }

  movetotrash(file:FileModel)
  {
    this.as.movetotrash(this.username,file.fileName).subscribe(
      (response:any) =>{
        console.log("response of move to trash",response);
        alert(`File '${file.fileName}' deleted successfully!`);
      },
      (error:any) =>{
        if(error.status==404){
          console.log("error message of move to trash",error);
          alert(`File '${file.fileName}' not deleted`);
        }
      }
    );
  }
  showfolderfiles(folder:string){
    this.as.getfolderfiles(this.username,folder).subscribe(
      (file:FileModel[])=>{
        this.folderfiles=file;
        this.showfolder=true;
        console.log("response form the server",file)
      },
      (error:any)=>{
        this.folderfiles=[]
        console.log("error form the server",error);
      }
    )
  }
closeshowfolder()
{
  this.showfolder=false;
  this.foldername='';
}

downloadFolder() {
  this.as.getfolderfiles(this.username, this.foldername).subscribe(
    (file: FileModel[]) => {
      this.downloadfiles=file

      const zip = new JSZip();

      // Iterate through each file in the folder and add it to the ZIP archive
      this.downloadfiles.forEach(file => {
        this.filedata=file.fileData
        const binaryString = atob(this.filedata);
        const arrayBuffer = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          arrayBuffer[i] = binaryString.charCodeAt(i);
        }
        zip.file(file.fileName, arrayBuffer, { binary: true });
      });

      // Generate the ZIP file asynchronously
      zip.generateAsync({ type: 'blob' }).then((zipFile) => {
        // Create object URL for the Blob
        const zipFileURL = URL.createObjectURL(zipFile);

        // Create <a> element to trigger download
        const a = document.createElement('a');
        a.href = zipFileURL;
        a.download = this.foldername + '.zip';
        a.click();

        // Revoke the object URL to free up resources
        URL.revokeObjectURL(zipFileURL);
      });
    },
    (error) => {
      console.error('Error downloading folder:', error);
      // Handle error appropriately
    }
  );
}

}
