import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PersonsRoutingModule } from './persons-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { AddPersonFormComponent } from './add-person-form/add-person-form.component';
import { EditPersonComponent } from './edit-person/edit-person.component';

@NgModule({
  declarations: [HomeComponent, AddPersonFormComponent, EditPersonComponent],
  imports: [
    CommonModule,
    PersonsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class PersonsModule {}
