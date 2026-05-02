import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http-service';
import { Observable, map, shareReplay } from 'rxjs';
import { Deal, Store, GameDetails } from 'src/app/core/models/cheapshark.models';

@Injectable({
  providedIn: 'root'
})
export class GameProvider {

  private stores$: Observable<Store[]> | null = null;

  constructor(private http: HttpService) {}

  getStores(): Observable<Store[]> {
    if (!this.stores$) {
      this.stores$ = this.http.get<Store[]>('stores').pipe(
        shareReplay(1)
      );
    }
    return this.stores$;
  }

  getTopDeals(): Observable<Deal[]> {
    return this.http.get<Deal[]>('deals', { pageSize: 10 });
  }

  searchDeals(query: string): Observable<Deal[]> {
    return this.http.get<Deal[]>('deals', { title: query });
  }

  getGameDetails(gameId: string): Observable<GameDetails> {
    return this.http.get<GameDetails>('games', { id: gameId });
  }

  getRedirectUrl(dealId: string): string {
    return `https://www.cheapshark.com/redirect?dealID=${dealId}`;
  }


}