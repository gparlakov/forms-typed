import { Component, OnInit } from '@angular/core';
import { typedFormArray, typedFormControl } from 'forms';
import { PersonContact } from '../person-contact/person-contact.model';

@Component({
  selector: 'fty-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  people = typedFormArray<PersonContact>([typedFormControl()]);
  constructor() { }

  ngOnInit(): void {
  }

  add() {
    this.people.push(typedFormControl());
  }

  removeAt(i: number) {
    if (this.people.at(i) != null) {
      this.people.removeAt(i);
    }
  }
  onSubmit() {
    this.people = typedFormArray<PersonContact>([typedFormControl({name: '', email: ''})]);
  }
}
