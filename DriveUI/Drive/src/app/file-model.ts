export interface FileModel {
    id: string; // Assuming string for ObjectId
    fileName: string;
    contentType: string;
    fileData:  Uint8Array; // Adjust data type as per your needs
  }
