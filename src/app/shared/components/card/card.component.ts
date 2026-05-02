import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { ToastController } from '@ionic/angular';
import { Deal } from 'src/app/core/models/cheapshark.models';


@Component({
  standalone: false,
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent  implements OnInit {

  constructor(
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  @Input() deal!: Deal; 

  // Emite un evento hacia la vista padre cuando se hace clic al corazón
  @Output() favoriteClicked = new EventEmitter<string>();

  // ESTA ES LA FUNCIÓN QUE TE FALTA O NO HAS GUARDADO:
  onFavorite() {
    this.favoriteClicked.emit(this.deal.gameID);
  }

}
