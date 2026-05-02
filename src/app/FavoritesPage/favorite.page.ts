import { Component } from '@angular/core';
import { GameProvider } from '../shared/services/game-provider';
import { Preferences } from '@capacitor/preferences';
import { GameDetails } from '../core/models/cheapshark.models';

@Component({
  standalone: false,
  selector: 'app-favorite',
  templateUrl: 'favorite.page.html',
  styleUrls: ['favorite.page.scss']
})
export class FavoritePage {
  favoriteGameDetails: GameDetails | null = null; 
  isLoading = false;
  constructor(private gameProvider: GameProvider) {}

  // Se ejecuta cada vez que el usuario entra a la pestaña
  async ionViewWillEnter() {
    this.loadFavorite();
  }

  async loadFavorite() {
    this.isLoading = true;
    
    // Leer el ID guardado desde Capacitor
    const { value } = await Preferences.get({ key: 'favoriteGame' });

    if (value) {
      this.gameProvider.getGameDetails(value).subscribe({
        next: (details) => {
          this.favoriteGameDetails = details;
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
    } else {
      this.favoriteGameDetails = null;
      this.isLoading = false;
    }
  }
}