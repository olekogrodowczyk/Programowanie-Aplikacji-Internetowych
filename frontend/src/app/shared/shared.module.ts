import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [NavbarComponent, FooterComponent, ModalComponent],
  imports: [CommonModule],
  exports: [NavbarComponent, FooterComponent, ModalComponent],
})
export class SharedModule {}
