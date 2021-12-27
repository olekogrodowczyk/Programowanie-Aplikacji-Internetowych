import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ModalComponent } from './modal/modal.component';
import { AuthModule } from '../auth/auth.module';
import { SharedRoutingModule } from './shared-routing.module';
import { SnackBarService } from './snack-bar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [NavbarComponent, FooterComponent, ModalComponent],
  imports: [CommonModule, AuthModule, SharedRoutingModule, MatSnackBarModule],
  exports: [NavbarComponent, FooterComponent, ModalComponent],
  providers: [SnackBarService],
})
export class SharedModule {}
