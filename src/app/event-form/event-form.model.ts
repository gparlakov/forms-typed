export interface EventForm {
  eventName: string;
  location: string;
  dateStart: Date;
  timeStart: string;
}

export function eventDefault() {
  const now = new Date();
  return {
    dateStart: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    timeStart: '17:00'
  } as EventForm;
}
