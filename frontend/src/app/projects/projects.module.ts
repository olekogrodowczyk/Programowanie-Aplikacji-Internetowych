import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectsRoutingModule } from './projects-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { AddProjectFormComponent } from './add-project-form/add-project-form.component';
import { EditProjectFormComponent } from './edit-project-form/edit-project-form.component';

@NgModule({
  declarations: [HomeComponent, AddProjectFormComponent, EditProjectFormComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ProjectsModule {}
