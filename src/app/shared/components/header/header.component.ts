import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  @Input() searchValue: string | undefined = '';
  @Input() isSearchDisabled: boolean = false;
  @Output() searchInput = new EventEmitter<any>();

  onSearch(event: any) {
    this.searchInput.emit(event);
  }
}