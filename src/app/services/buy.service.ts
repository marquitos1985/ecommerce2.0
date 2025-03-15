import { Injectable, OnInit } from '@angular/core';
import { ProductInterface } from '../interfaces/product/product-interface';
import { CarritoService } from './cart.service';
import { RegisterService, User } from './register-service/register.service';
import { AuthService } from './login/auth.service';
import { DistanceMatrixService } from './distance/distance-matrix.service';
import { CardsService } from './cards.service';
import { Card } from '../interfaces/cards/card';
import { Observable } from 'rxjs';
import { ProductInterface2 } from '../interfaces/product/product-interface2';
import { DiscountCoupon } from '../interfaces/product/discount-coupon';

@Injectable({
  providedIn: 'root',
})
export class BuyService {
  private cartItems: ProductInterface[] = [];
  private user: User | null;
  subTotalPrice: number;
  private shippingCostByKm: number = 100;

  constructor(
    private cartService: CarritoService,
    private authService: AuthService,
    private registerService: RegisterService,
    private distanceMatrixService: DistanceMatrixService,
    private cardsService: CardsService
  ) {
    this.user = null;
    this.subTotalPrice = 0;
  }

 
  public getCartItemsToBuy(): Observable<ProductInterface2[]> {
    return this.cartService.getCartItems();
  }
  public getUser(userId: string) {
    return this.registerService.getUserById(userId);
  }


    getSubtotal(discountCoupon: DiscountCoupon) {
      this.subTotalPrice = this.cartService.getTotalPrice(discountCoupon);
      return this.subTotalPrice;
    }

  getShippingPrice(destiny: string) {
    return this.distanceMatrixService.getApiDistanceMatrix(destiny);
  }

  async existsCard(card: Card): Promise<boolean> {
    let out:boolean = await this.cardsService.existsCard(card);
    return out;
  }
    
  public getShippingCostByKm(){
    return this.shippingCostByKm;
  }
}
