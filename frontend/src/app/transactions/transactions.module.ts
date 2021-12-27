import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { HomeComponent } from './home/home.component';
import { TransactionsService } from './transactions.service';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, TransactionsRoutingModule],
  providers: [TransactionsService],
})
export class TransactionsModule {}
