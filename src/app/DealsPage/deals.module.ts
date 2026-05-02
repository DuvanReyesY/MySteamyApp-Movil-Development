import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DealsPageRoutingModule } from './deals-routing.module';
import { DealsPage } from './deals.page';
import { SharedModule } from '../shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    DealsPageRoutingModule,
    SharedModule
  ],
  declarations: [DealsPage]
})
export class DealsPageModule {}