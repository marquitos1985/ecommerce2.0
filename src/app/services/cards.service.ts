import { Injectable } from '@angular/core';
import { Card } from '../interfaces/cards/card';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';
import { error } from 'console';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private cardsApiUrl = 'http://localhost:3000/cards';

  constructor(private http: HttpClient) {}

  getAllCardsPromise(urlApi: string): Promise<Card[] | undefined> {
    return this.http.get<Card[]>(urlApi).toPromise();
  }


    async existsCard(card: Card): Promise<boolean> {
      let out: boolean = false;
       await this.getAllCardsPromise(this.cardsApiUrl)
        .then((response) => {
          let cardList: Card[] | undefined = response;
          if (
            cardList?.find(
              (crd) =>
                crd.type === card.type &&
                crd.cardHolder === card.cardHolder &&
                crd.cardNumber === card.cardNumber &&
                crd.expirationDate === card.expirationDate &&
                crd.cvv === card.cvv &&
                crd.issuer === card.issuer
            )
          ) {
            out = true;
            
          } else {
            out = false;
            
          }
        })
        .catch((error) => {
          console.log(error);
          out = false;
          
        });
      return out;
    }

  
}
