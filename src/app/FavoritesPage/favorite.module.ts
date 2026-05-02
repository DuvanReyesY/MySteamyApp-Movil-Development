import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoritePage } from './favorite.page';
import { SharedModule } from '../shared/shared-module';

import { FavoritePageRoutingModule } from './favorite-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FavoritePageRoutingModule,
    SharedModule
  ],
  declarations: [FavoritePage]
})
export class FavoritePageModule {}
