import { Component } from '@angular/core';
import {  AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { UserdataService } from '../userdata.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators ,AbstractControl, ValidationErrors} from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent implements  AfterViewInit {
  @ViewChild('container') container!: ElementRef;
  form: FormGroup;
  registrationForm: FormGroup;
  show: string = '';
  errorMessage: string | null = null;
  constructor(private renderer: Renderer2, private us:UserdataService,private router:Router,private fb: FormBuilder)
   {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator
      ]]
    });
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator
      ]]
    });
   }
   passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const valid = hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;

    if (!valid) {
      return { passwordStrength: true };
    }

    return null;
  }

  username:string[]=[];

  ngAfterViewInit(): void {
    const signInBtn = this.container.nativeElement.querySelector('#sign-in-btn');
    const signUpBtn = this.container.nativeElement.querySelector('#sign-up-btn');

    this.renderer.listen(signUpBtn, 'click', () => {
      this.renderer.addClass(this.container.nativeElement, 'sign-up-mode');
    });

    this.renderer.listen(signInBtn, 'click', () => {
      this.renderer.removeClass(this.container.nativeElement, 'sign-up-mode');
    });
  } 
  toggleSignIn()
   {
    this.renderer.removeClass(this.container.nativeElement, 'sign-up-mode');
   }

  toggleSignUp()
   {
    this.renderer.addClass(this.container.nativeElement, 'sign-up-mode');
    }
      // code for login
  onSubmit() {
    if (this.form.valid) {
      this.us.getauth(this.form.value).subscribe(
        response => {
        if (response) {
          console.log('Response from server:', response);
            //  this.us.loadmyDrivefiles(this.form.value.username);
            //  this.us.loadtrashfiles(this.form.value.username);
            this.router.navigate(['/home/welcome']);
          } else {
            this.errorMessage = 'Invalid username or password';
            console.error('Invalid username or password');
           }
          },
            (error: HttpErrorResponse) => {
              this.errorMessage = 'An error occurred while logging in';
              console.error('Error response from server:', error);
            }
          );
        } else {
          this.errorMessage = 'Please fill in the required fields';
          console.error('Invalid form');
        }
 }
      // code for user registration 
      nSubmit() {
        if (this.registrationForm.valid) {
            this.us.postdata(this.registrationForm.value).subscribe({
              next: (response) => {
                console.log('Response from server:', response);
                this.toggleSignIn();
              },
              error: (error) => {
                console.error('Error response from server:', error);
              }
            });
          } 
          else {
            console.log('Form is invalid');
          }
        } 
        
}
    








       // get(form:NgForm)
  // {
  //   if(form.valid)
  //     {
  //       this.us.getauth(form.value).subscribe(
  //          response => {
  //           console.log('Response from server:', response);
  //           console.log(response.username);
  //           this.router.navigate(['/home']);
  //         },
  //         (error: HttpErrorResponse)=> {
  //           console.error('Error response from server:', error);
  //         }
  //       );
  //     } 
  //     else 
  //     {
  //       console.error(' Invalid user');
  //     }
  //     }


  
// code for user registration
//   save(form: NgForm) {
//     if (form.valid) {
//       this.us.postdata(form.value).subscribe({
//         next: (response) => {
//           console.log('Response from server:', response);
//           this.toggleSignIn();
//         },
//         error: (error) => {
//           console.error('Error response from server:', error);
//         }
//       });
//     } else {
//       console.error('Form is invalid');
//     }
//   }