import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Deal } from '../core/models/cheapshark.models';

@Component({
  standalone: false,
  selector: 'app-favorite',
  templateUrl: 'favorite.page.html',
  styleUrls: ['favorite.page.scss']
})
export class FavoritePage {

  favoriteDeal: Deal | null = null;
  isLoading = true;
  constructor() {}

  async ionViewWillEnter() {
    const { value } = await Preferences.get({ key: 'favoriteGame' });
    this.favoriteDeal = value ? JSON.parse(value) : null;
    this.isLoading = false;
  }

  async removeFavorite() {
    await Preferences.remove({ key: 'favoriteGame' });
    this.favoriteDeal = null;
  }

}