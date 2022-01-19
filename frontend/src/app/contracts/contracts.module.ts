import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ContractsRoutingModule } from './contracts-routing.module';
import { HomeComponent } from './home/home.component';
import { AddContractFormComponent } from './add-contract-form/add-contract-form.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [HomeComponent, AddContractFormComponent],
  imports: [
    CommonModule,
    ContractsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class ContractsModule {}
