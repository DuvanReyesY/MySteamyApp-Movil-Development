import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoritePage } from './favorite.page';

import { FavoritePageRoutingModule } from './favorite-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FavoritePageRoutingModule
  ],
  declarations: [FavoritePage]
})
export class FavoritePageModule {}
