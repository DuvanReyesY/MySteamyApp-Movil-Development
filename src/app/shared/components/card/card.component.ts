import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Deal } from 'src/app/core/models/cheapshark.models';
import { ModalController } from '@ionic/angular';
import { DealDetailModalComponent } from '../../modals/deal-detail-modal/deal-detail-modal.component';


@Component({
  standalone: false,
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent  implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  @Input() deal!: Deal; 

  @Output() favoriteClicked = new EventEmitter<Deal>();

  @Input() isFavorite: boolean = false;

  onFavorite(event: Event) {

    event.stopPropagation();
    event.preventDefault();

    this.favoriteClicked.emit(this.deal);
  }

  async openDealDetails() {
    const modal = await this.modalCtrl.create({
      component: DealDetailModalComponent,
      componentProps: { deal: this.deal },
      initialBreakpoint: 0.85,
      breakpoints: [0, 0.85, 1],
      cssClass: 'custom-bottom-sheet'
    });

    await modal.present();
  }

}
