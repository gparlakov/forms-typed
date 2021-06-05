import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCommonModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ShowFormControlModule } from 'ngx-show-form-control';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { EventFormComponent } from './event-form/event-form.component';
import { NgModelDemoComponent } from './ng-model-demo/ng-model-demo.component';
import { PartyFormComponent } from './party-form/party-form.component';
import { PersonContactComponent } from './person-contact/person-contact.component';
import { TagsListComponent } from './tags-list/tags-list.component';
import { PeopleComponent } from './people/people.component';

@NgModule({
  declarations: [
    AppComponent,
    PersonContactComponent,
    PartyFormComponent,
    EventFormComponent,
    TagsListComponent,
    NgModelDemoComponent,
    PeopleComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatCommonModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ShowFormControlModule.for(environment.production ? 'prod' : 'dev'),
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: 'party',
        component: PartyFormComponent,
      },
      {
        path: 'ngmodel',
        component: NgModelDemoComponent,
      },
      {
        path: 'tags',
        component: TagsListComponent,
      },
      {
        path: 'people',
        component: PeopleComponent,
      },
      {
        path: '**',
        redirectTo: 'party',
      },
    ]),
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
