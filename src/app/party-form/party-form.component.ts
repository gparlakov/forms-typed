import { Component, OnInit } from '@angular/core';
import { typedFormGroup } from '../shared/forms-util';
import { PartyForm } from './party-form.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'fty-party-form',
  templateUrl: './party-form.component.html',
  styleUrls: ['./party-form.component.css']
})
export class PartyFormComponent implements OnInit {
  form = typedFormGroup<PartyForm>({
    event: new FormControl(),
    invitees: new FormControl()
  });

  constructor() {}

  ngOnInit(): void {}
}
