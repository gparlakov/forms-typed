import { Component, OnInit } from '@angular/core';
import { typedFormArray, typedFormControl } from 'forms';

interface Tag {
  name: string;
  value: string;
}

@Component({
  selector: 'fty-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.css'],
})
export class TagsListComponent implements OnInit {
  form = typedFormArray<string>([]);

  constructor() {}
  /*  */
  ngOnInit(): void {}

  add() {
    this.form.push(typedFormControl(''));
  }

  removeAt(i: number) {
    if (this.form.at(i) != null) {
      this.form.removeAt(i);
    }
  }
  onSubmit() {
    this.form = typedFormArray<string>([]);
  }
}
