import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { HomeComponent } from './home/home.component';
import { TransactionsService } from './transactions.service';
import { DepositFormComponent } from './deposit-form/deposit-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomeComponent, DepositFormComponent],
  imports: [CommonModule, TransactionsRoutingModule, ReactiveFormsModule],
  providers: [TransactionsService],
  exports: [DepositFormComponent],
})
export class TransactionsModule {}
