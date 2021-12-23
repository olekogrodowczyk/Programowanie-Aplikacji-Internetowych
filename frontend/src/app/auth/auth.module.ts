import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './login-form/login-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterFormComponent } from './register-form/register-form.component';
import { SignoutComponent } from './signout/signout.component';

@NgModule({
  declarations: [LoginFormComponent, RegisterFormComponent, SignoutComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [LoginFormComponent, RegisterFormComponent],
})
export class AuthModule {}
