import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { Home1Component } from './home1/home1.component';
import { DriveComponent } from './drive/drive.component';
import { MyDriveComponent } from './my-drive/my-drive.component';
import { SharedFilesComponent } from './shared-files/shared-files.component';
import { TrashComponent } from './trash/trash.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {
    path:"",component:Home1Component
  },
  {
    path:'Login',component:LoginComponent
  },
  {
    path:'Signup',component:SignupComponent
  },
  {
    path:'About',component:AboutComponent
  },
  {
    path:'home1',component:Home1Component
  },
  {
    path:'home',component:HomeComponent
  },
  { 
    path: 'home', 
    component: HomeComponent,
    children: [
      { path: 'Drive', component: DriveComponent },
    ]
  },
  { 
    path: 'home', 
    component: HomeComponent,
    children: [
      { path: 'Trash', component: TrashComponent },
    ]
  },
  { 
    path: 'home', 
    component: HomeComponent,
    children: [
      { path: 'welcome', component:WelcomeComponent},
    ]
  },
  { 
    path: 'home', 
    component: HomeComponent,
    children: [
      { path: 'MyDrive',  component:MyDriveComponent },
    ]
  },
  { 
    path: 'home', 
    component: HomeComponent,
    children: [
      { path: 'SharedFiles', component: SharedFilesComponent },
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
