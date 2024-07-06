import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { ApicallsService } from './apicalls.service';
import { FileModel } from './file-model';
import { Usermodel } from './usermodel';
@Injectable({
  providedIn: 'root'
})
export class UserdataService{
  userName:string="";
  useremail:string="";
  files: FileModel[] = [];
  sharefiles: FileModel[] = [];
  drivefile:FileModel[]=[];

  trashfile:FileModel[]=[];
  constructor(private http: HttpClient, private as:ApicallsService) { }
  getuserdata(){
     return this.userName;
  }


  // sign up form posting data code
  postdata(data: any): Observable<any> {
    return this.as.saveuserdata(data).pipe(
      map(response => {
        console.log('Response received:', response);
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error occurred:', error.message);
        return of(error);
      })
    );
  }
 
  
  

  requestfile(data:any):Observable<any> {
    return this.as.sendmail(data).pipe(
      map(response => {
        console.log('Response received:', response);
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error occurred:', error.message);
        return of(error);
      })
    );
}
  getauth(data:any){
    return this.as.authapi(data).pipe(
      map(response=> {
        console.log('Response received:', response);
        localStorage.setItem('username',response.username);
        localStorage.setItem('userEmail',response.email);
        this.userName=response.username;
        this.useremail=response.Email;
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error occurred:', error.message);
        return of(error);
      })
    );
  }
 
  //my drive files loading function 
  // loaddriveFiles()
  // {
  //   this.as.getmydriveFiles(this.userName).subscribe(
  //     (files: FileModel[]) => {
  //       this.files = files;
  //       console.log("drive files",files);
  //       return files;
  //     },
  //     (error) => {
  //       if (error.status === 404) {
  //         this.files = [];
  //         console.log('Files not found');
  //       } 
  //     }
  //   );
  // }

  // loadtrashfiles(user:string):void
  // {
  //   this.as.trashfiles(user).subscribe(
  //     (files: FileModel[]) => {
  //       this.trashfile = files;
  //     },
  //     (error) => {
  //       if (error.status === 404) {
  //         this.trashfile = [];
  //         console.log('Files not found');
  //       }
  //     }
  //   );
  // }

  // loadmyDrivefiles(username:string):void{
  //   this.as.getdriveFiles(username).subscribe(
  //     (files: FileModel[]) => {
  //       this.drivefile = files;
  //     },
  //     (error) => {
  //       if (error.status === 404) {
  //         this.drivefile = [];
  //         console.log('Files not found');
  //       } 
  //     }
  //   );
  // }
  user:string='user5';
  private bseUrl='https://localhost:7110/api/File';
  uploadfile(form:FormData, username: string): Observable<any> {
    console.log("upload-files");
    return this.http.post(`${this.bseUrl}/upload?username=${this.userName}`, form).pipe(
      map(response => {
      console.log('Files uploaded successfully:', response);
      return response;
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('Error occurred:', error.message);
      return throwError(() => new Error('Error uploading files'));
    })
  );
  }
  private apiUrl = '';
  uploadfiles(data:FormData,foldername:string): Observable<any> {
   

    return this.as.filesupload(data,this.userName,foldername).pipe(
      map(response => {
        console.log('Files uploaded successfully:', response);
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error occurred:', error.message);
        return throwError(() => new Error('Error uploading files'));
      })
    );


    
  }


  private baseurl='https://localhost:7110/api/File';
  searchFiles(username: string, query: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseurl}/search?username=${username}&query=${query}`);
  }
  
  private bpiUrl = 'https://localhost:7110/api/file/trash'; 

    

moveFile(username: string, filename: string): Observable<any> {
  const url = `${this.bpiUrl}?filename=${filename}&username=${username}`;
      return this.http.post<any>(url,null);
    }
}
 
