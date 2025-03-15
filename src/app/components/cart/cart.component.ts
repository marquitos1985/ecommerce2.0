import { Component, OnInit, OnDestroy } from '@angular/core';
import { CarritoService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { ProductInterface2 } from '../../interfaces/product/product-interface2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  carrito: ProductInterface2[] = [];
  quantity: number;
  totalQty: number = 0;
  private qtySubscription: Subscription = new Subscription();

  constructor(
    private carritoService: CarritoService,
    private location: Location
  ) {
    this.quantity = 0;
  }

  ngOnInit(): void {
    this.carritoService.getCartItems().subscribe((cart) => {
      this.carrito = cart;
    });

    this.qtySubscription = this.carritoService
      .getTotalQuantity()
      .subscribe((qty) => {
        this.totalQty = qty;
      });
  }

    addToCart(product: ProductInterface2): void {
      this.carritoService.addToCart(product);
    }

  decreaseQuantity(productId: string): void {
    this.carritoService.decreaseQuantity(productId);
  }

  getTotalPrice(): number {
    return this.carrito.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  removeProduct(productId: string): void {
    this.carritoService.removeProduct(productId);
  }

  clearCart(): void {
    this.carritoService.clearCart();
  }

  ngOnDestroy(): void {
    if (this.qtySubscription) {
      this.qtySubscription.unsubscribe();
    }
  }

  goBack(): void {
    this.location.back();
  }

  removeItem(id: string){
    this.carritoService.removeProduct(id);
  }
}
