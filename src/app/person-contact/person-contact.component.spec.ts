import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonContactComponent } from './person-contact.component';

describe('PersonContactComponent', () => {
  let component: PersonContactComponent;
  let fixture: ComponentFixture<PersonContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
