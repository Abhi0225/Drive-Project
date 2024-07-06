import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserdataService } from '../userdata.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  constructor(private us: UserdataService){}
  save(form: NgForm) {
    if (form.valid) {
      console.log(form.value.user);
      this.us.postdata(form.value.user).subscribe({
        next: (response) => {
          console.log('Response from server:', response);
        },
        error: (error) => {
          console.error('Error response from server:', error);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }
// save(data:any)
// {
//   // console.log(data.value);
//   // this.us.postdata(data.value);
//   this.us.postdata(data).subscribe({
//     next: (response) => {
//       console.log('Response from server:', response);
//     },
//     error: (error) => {
//       console.error('Error response from server:', error);
//     }
//   });
}


