import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ModalComponent } from './modal/modal.component';
import { AuthModule } from '../auth/auth.module';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  declarations: [NavbarComponent, FooterComponent, ModalComponent, NotificationComponent],
  imports: [CommonModule, AuthModule],
  exports: [NavbarComponent, FooterComponent, ModalComponent],
})
export class SharedModule {}
