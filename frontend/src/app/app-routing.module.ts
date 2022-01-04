import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { TransactionsGuard } from './transactions/transactions.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'persons',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./persons/persons.module').then((mod) => mod.PersonsModule),
  },
  {
    path: 'transactions',
    canLoad: [AuthGuard, TransactionsGuard],
    loadChildren: () =>
      import('./transactions/transactions.module').then(
        (mod) => mod.TransactionsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
