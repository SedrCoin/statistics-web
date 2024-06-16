import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BinanceService {
  private apiUrl: string = 'https://api.binance.com/api/v3/ticker/price';

  constructor(private http: HttpClient) {}

  getPairs(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}