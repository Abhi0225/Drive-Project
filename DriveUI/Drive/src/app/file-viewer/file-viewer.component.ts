import { Component, Input, OnChanges } from '@angular/core';
import { FileModel } from '../file-model';
import { SafeUrl,DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrl: './file-viewer.component.css'
})
export class FileViewerComponent {
  @Input() file: FileModel | null = null;
  fileURL: string | null = null;
  fileda: any;
  fileContent:string="";
  imageurl:any;

  constructor(private sanitizer: DomSanitizer) { }
  ngOnChanges(): void {
    if (this.file) {
      this.fileda=this.file.fileData;
      this.fileContent=atob(this.fileda);
      // this.fileContent=atob(this.fileda);
      const fileBlob = new Blob([new Uint8Array(this.file.fileData)], { type: this.file.contentType });
      this.fileURL = URL.createObjectURL(fileBlob);
    } else {
      this.fileURL = null;
    }
  }
  close(): void {
    this.fileURL = null;
  }
  // displayFileData(): void {
  //   // Implement logic to display file data in the UI (e.g., render as text, image, etc.)
  //   // Example: For text/plain
  //   if (this.file && this.file.contentType === 'text/plain') {
  //     const fileDataArrayBuffer = this.fileda.buffer;
  //     const fileDataString = new TextDecoder('utf-8').decode(fileDataArrayBuffer);
  //     console.log('File Content:', fileDataString);
  //     // this.fileContent=fileDataString;
  //     // Bind fileDataString to UI element
  //   }

  //   // Add other cases as per your file types (image, PDF, etc.)
  // }
  
  
  
}
