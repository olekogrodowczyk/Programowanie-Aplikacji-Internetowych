import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignoutComponent } from '../auth/signout/signout.component';

const routes: Routes = [{ path: 'signout', component: SignoutComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class SharedRoutingModule {}
