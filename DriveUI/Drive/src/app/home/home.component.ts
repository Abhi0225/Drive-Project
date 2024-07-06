import { Component, OnInit } from '@angular/core';
import { UserdataService } from '../userdata.service';
import { FileModel } from '../file-model';
import { Foldermodel } from '../foldermodel';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  display:string='notshow';
  profile:boolean=false;
  uploadfolder:boolean=false;
  requestfile:boolean=false;
  uploadfile:boolean=false;
  to: any;
  subject: any;
  body: any;
  userdata:String="";
  files: FileModel[] = [];
  progress: number = 0;
  selectedFile: FileModel | null = null; 
  fileToView: FileModel | null = null;
  selectedfile: File| null = null;
  filecontent:any;
  email = {
    to: '',
    subject: '',
    message: ''
  };
  username:string=localStorage.getItem('username') ?? "" ;
  userEmail:string=localStorage.getItem('userEmail')??"";
  searchQuery: string = '';
  suggestions: string[] = [];
  selectedFiles: File[] = [];
  errorMessage: string = '';
  uploadForm: FormGroup;
  uploadForms:FormGroup;
    constructor(private  us:UserdataService ,private fb: FormBuilder) {
      this.uploadForm = this.fb.group({
        username: [''],
        file: [null]
      });
      this.uploadForms = this.fb.group({
        foldername: [''],
        folder: [null]
      });
     }
  clear()
  {
     localStorage.clear();
  }
 openprofile()
 {
  this.profile=true;
   this.userdata=this.us.getuserdata();
 }
 openuploadfolder()
 {
  this.uploadfolder=true;
 }
 openuploadfile()
 {
  this.uploadfile=true;
 }
 openrequestfile()
 {
  this.requestfile=true;
 }

 upload(file:any)
 {
  console.log(file);
 }
 
onSearchChange(query: string): void {
  if (query && this.username) {
    this.us.searchFiles(this.username, query).subscribe({
      next: (data) => {
        this.suggestions = data;
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
  } else {
    this.suggestions = [];
  }
}

//upload file related
onfileChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.uploadForm.patchValue({
      file: file
    });
  }
}
// upload file related
onUpload(username: string) {
  if (this.uploadForm.get('username')?.value && this.uploadForm.get('file')?.value) {
    console.log("file upload");
    const formData = new FormData();
    const file = this.uploadForm.get('file')?.value;
    const fileName = file.name;

    formData.append('username', this.uploadForm.get('username')?.value);
    formData.append('file', file);

    this.us.uploadfile(formData, username).subscribe(
      (response: any) => {
        console.log('Upload response:', response);
        alert(`File '${fileName}' uploaded successfully!`);
      },
      (error: any) => {
        console.error('Upload error:', error);
        alert(`File '${fileName}' upload failed. Please try again.`);
      }
    );
  } else {
    alert('Username and file are required to upload.');
  }
}
//folder related code
onFolderSelected(event: any) {
  const files = event.target.files;
  this.uploadForms.patchValue({
    folder: files
  });
}
//folder related code
uploadFiles() {
  console.log('uploadfiles');
  const files: FileList = this.uploadForms.get('folder')?.value;
  if ( files && files.length > 0) {
    console.log("folder upload");

    const formData = new FormData();
    formData.append('foldername',this.uploadForms.get('foldername')?.value)
    formData.append('username', this.username);

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].webkitRelativePath);
    }
    this.us.uploadfiles(formData,this.uploadForms.get('foldername')?.value).subscribe(
      (response: any) => {
        alert('Folder uploaded successfully!');
      },
      (error: any) => {
        console.error('Upload error:', error);
        alert('Folder upload failed. Please try again.');
      }
    );
  } else {
    alert('Username and folder are required to upload.');
  }
}

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length) {
    this.selectedfile = input.files[0];
    console.log(this.selectedFile);
  }
}

onFileChange(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  if (inputElement.files) {
    this.uploadForm.get('files')?.setValue(Array.from(inputElement.files));
  }
}


// uploadfiles() {
//   const formData = new FormData();
//   formData.append('username', this.uploadForm.get('username')?.value);
//   const files = this.uploadForm.get('files')?.value;
//   if (files && files.length > 0) {
//     for (let i = 0; i < files.length; i++) {
//       formData.append('files[]', files[i]);
//     }
//   }


//   // Display formData for debugging purposes
//   console.log(formData);

//   this.us.uploadfiles(formData).subscribe(
//     (response: any) => {
//       console.log('Upload response:', response);
//       alert('Files uploaded successfully');
//     },
//     (error: any) => {
//       this.errorMessage = error.message;
//       console.error('Error uploading files:', error);
//     }
//   );

// }


// code for sending email 
sendEmail(a:any,b:any,c:any) {
  this.email.to=a.value;
  this.email.subject=b.value;
  this.email.message=c.value;
  console.log(this.email.to);
  this.us.requestfile(this.email).subscribe({
      next: (response) => {
        console.log('Response from server:', response);
        alert("email is sent to the user");
      },
      error: (error) => {
        console.error('Error response from server:', error);
        alert("email not sent");
      }
    });
  } 





  downloadSelectedFile(file: FileModel): void {
    if (file) {
      this.filecontent=file.fileData
      const byteCharacters = atob(this.filecontent);
      const byteNumbers = new Array(byteCharacters.length);
    
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
    
      const byteArray = new Uint8Array(byteNumbers);
      const fileBlob = new Blob([byteArray], { type: file.contentType });
      const fileURL = URL.createObjectURL(fileBlob);
    
      // Create an anchor element and trigger a download
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = file.fileName;
      a.click();
    
      // Revoke the object URL to free up memory
      URL.revokeObjectURL(fileURL);
    }
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
  closerequestfile()
  {
  this.requestfile=false;
  }

  closeuploadfile()
  {
  this.uploadfile=false;
  }

  closeprofile()
  {
    this.profile=false;
  }

  closeuploadfolder()
  {
   this.uploadfolder=false;
  }

  
}




