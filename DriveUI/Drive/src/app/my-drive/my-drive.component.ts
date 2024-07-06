import { Component, OnInit } from '@angular/core';
import { UserdataService } from '../userdata.service';
import { FileModel } from '../file-model';
import { ApicallsService } from '../apicalls.service';
import JSZip from 'jszip';
@Component({
  selector: 'app-my-drive',
  templateUrl: './my-drive.component.html',
  styleUrl: './my-drive.component.css'
})
export class MyDriveComponent implements OnInit{
  filedata:any;
  folderfiles:FileModel[]=[];
  showfolder:boolean=false;
  downloadfiles:FileModel[]=[];
  files: FileModel[] = [];
  selectedFile: FileModel | null = null; 
  fileToView: FileModel | null = null;
  isShareModalOpen: boolean = false;
  myDrive:boolean=true;
  mydrivefiles:FileModel[]=[];
  foldernames:any;
  foldername:string='';
  username:string=localStorage.getItem('username') ?? "" ;
  constructor(private fileService:UserdataService, private as:ApicallsService){}
  ngOnInit(): void {
    this.loadmyDrivefiles();
    this.loadfoldernames();
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
  openShareModal() {
    if (this.selectedFile) {
      this.isShareModalOpen = true;
    }
  }
  onFolderDoubleClick(folder:string){
    this.foldername=folder;
    this.showfolderfiles(folder);
  }
  closeShareModal() {
    this.isShareModalOpen = false;
  }
  loadmyDrivefiles():void{
    this.as.getdriveFiles(this.username).subscribe(
      (files: FileModel[]) => {
        this.mydrivefiles = files;
      },
      (error) => {
        if (error.status === 404) {
          this.mydrivefiles = [];
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
