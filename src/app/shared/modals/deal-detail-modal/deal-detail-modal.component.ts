// deal-detail.modal.ts
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Deal } from 'src/app/core/models/cheapshark.models';
import { Browser } from '@capacitor/browser';



@Component({
  standalone: false,
  selector: 'app-deal-detail',
  templateUrl: './deal-detail-modal.component.html',
  styleUrls: ['./deal-detail-modal.component.scss'],
})
export class DealDetailModalComponent implements OnInit {

  @Input() deal!: Deal;

  // Diccionario para los nombres de las tiendas
 private storeNames: { [key: string]: string } = {
    '1': 'Steam', '2': 'GamersGate', '3': 'GreenManGaming', '4': 'Amazon',
    '5': 'GameStop', '6': 'Direct2Drive', '7': 'GOG', '8': 'Origin',
    '9': 'Get Games', '10': 'Shiny Loot', '11': 'Humble Store', '12': 'Desura',
    '13': 'Uplay', '14': 'IndieGameStand', '15': 'Fanatical', '16': 'Gamesrocket',
    '17': 'Games Republic', '18': 'SilaGames', '19': 'Playfield', '20': 'ImperialGames',
    '21': 'WinGameStore', '22': 'FunStockDigital', '23': 'GameBillet', '24': 'Voidu',
    '25': 'Epic Games Store', '26': 'Razer Game Store', '27': 'Gamesplanet',
    '28': 'Gamesload', '29': '2Game', '30': 'IndieGala', '31': 'Blizzard Shop',
    '32': 'AllYouPlay', '33': 'DLGamer', '34': 'Noctre', '35': 'DreamGame'
  };

  constructor(
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {}

  get savingsAmount(): number {
    if (!this.deal) return 0;

    const normal = parseFloat(this.deal.normalPrice) || 0;
    const sale = parseFloat(this.deal.salePrice) || 0;
    
    return normal - sale;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  // Obtener el nombre de la tienda
  getStoreName(storeID: string): string {
    return this.storeNames[storeID] || 'Unknown Store';
  }

  getStoreIconIndex(storeID: string): number {
  return parseInt(storeID) - 1;
}

  async viewDeal() {
    if (this.deal.dealID) {
      const url = `https://www.cheapshark.com/redirect?dealID=${this.deal.dealID}`;

      await Browser.open({ 
        url: url
      });
    }
  }
}