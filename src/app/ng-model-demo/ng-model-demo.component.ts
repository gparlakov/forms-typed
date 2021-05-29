import { Component, OnInit } from '@angular/core';
import { PersonContact } from '../person-contact/person-contact.model';

@Component({
  selector: 'fty-ng-model-demo',
  templateUrl: './ng-model-demo.component.html',
  styleUrls: ['./ng-model-demo.component.css']
})
export class NgModelDemoComponent implements OnInit {
  person: PersonContact;

  constructor() { }

  ngOnInit(): void {
  }

}
