import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyFormComponent } from './party-form.component';

describe('PartyFormComponent', () => {
  let component: PartyFormComponent;
  let fixture: ComponentFixture<PartyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
