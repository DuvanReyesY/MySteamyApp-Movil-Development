import { Component, OnInit } from '@angular/core';
import { GameProvider } from '../shared/services/game-provider';
import { Deal } from '../core/models/cheapshark.models';
import { Preferences } from '@capacitor/preferences';
import { ToastController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-deals',
  templateUrl: 'deals.page.html',
  styleUrls: ['deals.page.scss']
})
export class DealsPage implements OnInit {
  topDeals: Deal[] = [];
  searchResults: Deal[] = [];
  isLoading = true;
  searchQuery = '';

  constructor(
    private gameProvider: GameProvider,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadTopDeals();
  }

  loadTopDeals() {
    this.isLoading = true;
    this.gameProvider.getTopDeals().subscribe({
      next: (deals) => {
        this.topDeals = deals;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

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