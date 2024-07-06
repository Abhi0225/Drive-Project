import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  show :string="Founder";
  name:string="Mr.Name";
  details(data:any)
  { 
    console.log(data);
     if(data=='Founder')
      {
        this.show="Founder";
        this.name="Mr.Name";
      }
      else if(data=='CoFounder')
      {
        this.show="CoFounder";
        this.name="Mr.Name";
      }
      else if(data=='CEO')
      {

        this.show="Ceo";
        this.name="Mr.Name";
      }
      else
      {
        this.show="about";
        this.name="Details";
      }
  }
}
