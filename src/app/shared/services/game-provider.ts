import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http-service';
import { Observable, map, shareReplay } from 'rxjs';
import { Deal, Store, GameDetails } from 'src/app/core/models/cheapshark.models';

@Injectable({
  providedIn: 'root'
})
export class GameProvider {
  // Guardamos las tiendas en un observable con shareReplay para no pedirlas cada vez
  private stores$: Observable<Store[]> | null = null;

  constructor(private http: HttpService) {}

  /**
   * Obtiene el listado de tiendas (Steam, GOG, etc.)
   */
  getStores(): Observable<Store[]> {
    if (!this.stores$) {
      this.stores$ = this.http.get<Store[]>('stores').pipe(
        shareReplay(1) // Cachea el resultado
      );
    }
    return this.stores$;
  }

  /**
   * Obtiene las 5 mejores ofertas para el carrusel de Home
   */
  getTopDeals(): Observable<Deal[]> {
    return this.http.get<Deal[]>('deals', { pageSize: 5 });
  }

  /**
   * Busca ofertas por título de juego
   * @param query nombre del juego
   */
  searchDeals(query: string): Observable<Deal[]> {
    return this.http.get<Deal[]>('deals', { title: query });
  }

  /**
   * Obtiene detalles específicos de un juego (Útil para el Modal y Widget)
   */
  getGameDetails(gameId: string): Observable<GameDetails> {
    return this.http.get<GameDetails>('games', { id: gameId });
  }

  /**
   * Genera la URL de redirección de CheapShark
   */
  getRedirectUrl(dealId: string): string {
    return `https://www.cheapshark.com/redirect?dealID=${dealId}`;
  }


}