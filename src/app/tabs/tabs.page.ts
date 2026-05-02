import { Component } from '@angular/core';
import { GameProvider } from '../shared/services/game-provider';
import { Preferences } from '@capacitor/preferences';
import { ToastController } from '@ionic/angular';
import { Deal } from '../core/models/cheapshark.models';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {
  searchResults: Deal[] = [];
  isLoading = true;
  searchQuery = '';
   
  savedFavoriteId: string | null = null;
  constructor(
    private gameProvider: GameProvider,
    private toastCtrl: ToastController
  ) {}

  onSearch(event: any) {
    this.searchQuery = event.target.value.trim();
    
    if (!this.searchQuery) {
      this.searchResults = [];
      return;
    }

    this.isLoading = true;
    this.gameProvider.searchDeals(this.searchQuery).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  async saveFavorite(gameId: string) {

    this.savedFavoriteId = gameId;
  
    await Preferences.set({ key: 'favoriteGame', value: gameId });

    const toast = await this.toastCtrl.create({
      message: 'Game saved as favorite! 🎮',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }

}


