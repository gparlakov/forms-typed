import { EventForm } from '../event-form/event-form.model';
import { PersonContact } from '../person-contact/person-contact.model';

export interface PartyForm {
  invitees: PersonContact[];
  event: EventForm;
}
