import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AboutComponent } from './about/about.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { UserdataService } from './userdata.service';
import { provideHttpClient,withFetch } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Home1Component } from './home1/home1.component';
import { FileViewerComponent } from './file-viewer/file-viewer.component';
import { DriveComponent } from './drive/drive.component';
import { MyDriveComponent } from './my-drive/my-drive.component';
import { SharedFilesComponent } from './shared-files/shared-files.component';
import { TrashComponent } from './trash/trash.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    AboutComponent,
    HomeComponent,
    Home1Component,
    FileViewerComponent,
    DriveComponent,
    MyDriveComponent,
    SharedFilesComponent,
    TrashComponent,
    WelcomeComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    UserdataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
