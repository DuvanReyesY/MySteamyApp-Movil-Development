import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { InputComponent } from './components/input/input.component';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './components/header/header.component';
import { DealDetailModalComponent } from './modals/deal-detail-modal/deal-detail-modal.component';

@NgModule({
  declarations: [CardComponent, InputComponent, HeaderComponent, DealDetailModalComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    CardComponent, 
    InputComponent,
    HeaderComponent,
    DealDetailModalComponent
  ]
})
export class SharedModule { }
