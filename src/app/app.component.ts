import { Component } from '@angular/core';
import { PersonContact } from './person-contact/person-contact.model';

@Component({
  selector: 'fty-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'forms-typed';
  person: PersonContact;
}
