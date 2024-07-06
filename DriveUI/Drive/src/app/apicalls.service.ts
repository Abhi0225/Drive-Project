import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileModel } from './file-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApicallsService {
  private _saveuserdata = 'https://localhost:7110/api/User';
  private _auth ='https://localhost:7110/api/User/user';
  private _sendmail='https://localhost:7110/api/Email/send';
  private _getdrivefiles='https://localhost:7110/api/File/files/username';
  private _fileshare='https://localhost:7110/api/SharedFile';
  private _sharedfiles='https://localhost:7110/api/File/shared'
  private _getmydrivefiles='https://localhost:7110/api/File/share';
  private _gettrashfiles='https://localhost:7110/api/File/trashfiles';
  private _move_to_trash='https://localhost:7110/api/File/trash';
  private _filesuploads ='https://localhost:7110/api/File/uploadfolder';
  private _restorefiles='https://localhost:7110/api/File/restoretrashfiles';
  private _downloadfile='https://localhost:7110/api/Email/api/filedownload';
  private _deletefile='https://localhost:7110/api/File/filedelete';
  private _getfoldername='https://localhost:7110/api/File/foldernames';
  private _getfolderfiles='https://localhost:7110/api/File/filesbyfoldernames';
  constructor(private http:HttpClient) {}

  authapi(data:any)
  {
    return this.http.post<any>(this._auth,data);
  }

  saveuserdata(data:any)
  {
    return this.http.post<any>(this._saveuserdata, data,{responseType: 'json'});
  }

  sendmail(data:any)
  {
    return this.http.post<any>(this._sendmail, data,{responseType: 'json'});
  }

  getmydriveFiles(a:string): Observable<FileModel[]> 
  {
    const url = `${this._getmydrivefiles}?receiverUsername=${a}`;
    return this.http.get<FileModel[]>(url);
  }

  fileshare(shareData:any): Observable<any> 
  {
    return this.http.post<any>(this._fileshare, shareData);
  }

  sharedfile(name:any): Observable<any>
  { 
    const url = `${this._sharedfiles}?receiverUsername=${name}`;
 
    return this.http.get<any[]>(url);
  }

  getdriveFiles(user:string): Observable<FileModel[]> 
  {
    const url = `${this._getdrivefiles}?username=${user}`;
    return this.http.get<FileModel[]>(url);
  }

  trashfiles(user:string): Observable<FileModel[]> 
  {
    const url = `${this._gettrashfiles}?username=${user}`;
    return this.http.get<FileModel[]>(url);
  }

  filesupload(formdata:any,user:String,foldername:string):Observable<any>
  {
    const url = `${this._filesuploads}?username=${user}&foldername=${foldername}`;
    return this.http.post<any>(url, formdata);
  }

  RestoreFiles(username:string ,filename:string)
  {
    const url= `${this._restorefiles}?username=${username}&filename=${filename}`;
    console.log(url);
    return this.http.get<any>(url);
  }

  movetotrash(username:string,filename:any)
  {           
    const url=`${this._move_to_trash}?filename=${filename}&username=${username}`;
    return this.http.post<any>(url,'');
  }
  downloadfile(username:string, filename:string): Observable<FileModel> 
  {
    const url=`${this._downloadfile}?username=${username}&filename=${filename}`;
    console.log(url);
    return this.http.get<FileModel>(url);
  }
  deletefile(username:string,filename:string){
    const url= `${this._deletefile}?username=${username}&filename=${filename}`
    return this.http.delete<any>(url);
  }
  getfoldernames(username:string)
  {
    const url=`${this._getfoldername}?username=${username}`;
    return this.http.get<any>(url);
  }
  getfolderfiles(username:string,filename:string)
  {
    const url=`${this._getfolderfiles}?username=${username}&foldername=${filename}`;
    return this.http.get<any>(url);
  }
}
