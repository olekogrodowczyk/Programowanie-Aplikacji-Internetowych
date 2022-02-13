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
  {
    path: 'projects',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./projects/projects.module').then((mod) => mod.ProjectsModule),
  },
  {
    path: 'contracts',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./contracts/contracts.module').then(
        (modl) => modl.ContractsModule
      ),
  },
  {
    path: 'users',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./users/users.module').then((mod) => mod.UsersModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
