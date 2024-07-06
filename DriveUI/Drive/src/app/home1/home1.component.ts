import { Component, OnInit} from '@angular/core';
import { UserdataService } from '../userdata.service';
import { FileModel } from '../file-model';

@Component({
  selector: 'app-home1',
  templateUrl: './home1.component.html',
  styleUrl: './home1.component.css'
})
export class Home1Component implements OnInit{
  files: FileModel[] = [];
  selectedFile: FileModel | null = null; 
  fileToView: FileModel | null = null;
  constructor(private fileService: UserdataService) {}

  ngOnInit(): void {
    // this.loadFiles('user5');
  }

  // loadFiles(a:any): void {
  //   this.fileService.getFiles(a)
  //     .subscribe(
  //       (files: FileModel[]) => {
  //         this.files = files;
  //       },
  //       (error) => {
  //         console.error('Error fetching files:', error);
  //       }
  //     );
  // }
  downloadFile(id: string): void {
    // Implement your download logic here, for example:
    console.log('Downloading file with id:', id);
    // You can implement download functionality here, e.g., redirecting to a download URL
    // window.open(`api/files/${id}/download`, '_blank'); // Example API endpoint
  }

  onFileClick(file: FileModel): void {
    this.selectedFile = file;
  }

  onFileDoubleClick(file: FileModel): void {
    // Open the file content, for example, in a new window or modal
    // const fileBlob = new Blob([new Uint8Array(file.fileData)], { type: file.contentType });
    // const fileURL = URL.createObjectURL(fileBlob);
   // const sanitizedURL: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(fileURL);
    //window.open(sanitizedURL.toString(), '_blank');
    // window.open(fileURL, '_blank');
    this.fileToView = file;
  }

  downloadSelectedFile(file: FileModel): void {
    if (file) {
      const fileBlob = new Blob([new Uint8Array(file.fileData)], { type: file.contentType });
      const fileURL = URL.createObjectURL(fileBlob);
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = file.fileName;
      a.click();
      URL.revokeObjectURL(fileURL);
    }
  }
}
