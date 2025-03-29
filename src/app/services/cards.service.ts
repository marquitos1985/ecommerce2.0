import { Injectable } from '@angular/core';
import { Card } from '../interfaces/cards/card';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { response } from 'express';
import { error } from 'console';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  //private cardsApiUrl = 'http://localhost:3000/cards';

  private cardsApiUrl = 'http://localhost:8080/inventario-app/cards';
  constructor(private http: HttpClient) {}

  private getAllCardsPromise(urlApi: string): Promise<Card[] | undefined> {
    return this.http.get<Card[]>(urlApi).toPromise();
  }

  /* private getByCardNumber(urlApi: string, card: Card):Promise<Card | undefined>{

    const httpOptions = {
      headers: new HttpHeaders({'content-Type': 'application/json'}),
    };
    return this.http.post<Card>(urlApi, card,httpOptions).toPromise();
  } */

  public getByCardNumber(card: Card):Observable<Card>{

    const httpOptions = {
      headers: new HttpHeaders({'content-Type': 'application/json'}),
    };
    return this.http.post<Card>(this.cardsApiUrl, card,httpOptions);
  }

    async existsCard(card: Card): Promise<boolean> {
      let out: boolean = false;
       /* await this.getAllCardsPromise(this.cardsApiUrl)
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
          
        }); */
        /* await this.getByCardNumber(this.cardsApiUrl, card).subscribe({
          next: response =>{
            let card: Card = response;
            console.log("Response: " + response);
            if (card != null){
              out = true; 
              } else {
              out = false;
            }
          },
          error: error =>{
            console.log(error);
            out = false;
          }
        }) */
        /* .then((response) => {
          let card: Card | undefined = response;
          console.log("Response: " + response);
          if (card != undefined){
            out = true; 
            } else {
            out = false;
          }
        })
        .catch((error) => {
          console.log(error);
          out = false;
          
        }); */
      return out;
    }

    /* public _existsCard(card: Card): Observable<boolean> {
      let out: boolean = false;
      
        this.getByCardNumber(this.cardsApiUrl, card).subscribe({
          next: response =>{
            let card: Card = response;
            console.log("Response: " + response);
            if (card != null){
              out = true; 
              } else {
              out = false;
            }
          },
          error: error =>{
            console.log(error);
            out = false;
          }
        })
        
      return out;
    } */
 
}
