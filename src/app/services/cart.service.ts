import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ProductInterface2 } from '../interfaces/product/product-interface2';
import { DiscountCoupon } from '../interfaces/product/discount-coupon';
import { DiscountCouponService } from './discount-coupon/discount-coupon.service';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private cart: ProductInterface2[] = [];
  private cartSubject = new BehaviorSubject<ProductInterface2[]>([]);
  private cartQuantitySource = new BehaviorSubject<number>(0);
  private cartStockSource = new BehaviorSubject<number>(0);

  constructor(private discounCouponService: DiscountCouponService) {
    this.loadCart();
  }

  getCartItems() {
    return this.cartSubject.asObservable();
  }

  getTotalQuantity(): Observable<number> {
    return this.cartQuantitySource.asObservable();
  }

  getCartStock(): Observable<number> {
    return this.cartStockSource.asObservable();
  }

  getDescriptionUntilFirstDot(description: string): string {
    const firstDotIndex = description.indexOf('.');
    if (firstDotIndex === -1) {
      return description;
    }

    return description.slice(0, firstDotIndex + 1);
  }

  

    addToCart(product: ProductInterface2): void {
      const existingProduct = this.cart.find((p) => p.id === product.id);
      const shortDescription = this.getDescriptionUntilFirstDot(
        product.description
      );
      
  
      if (product.stock <= 0) {
        Swal.fire({
          icon: 'error',
          title: 'No hay suficiente stock',
          text: `Lo sentimos, no hay stock disponible para el producto ${shortDescription}.`,
        });
        return;
      }
  
      if (existingProduct) {
        if (existingProduct.quantity < product.stock) {
          existingProduct.quantity++;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'No hay más stock disponible',
            text: `No puedes añadir más unidades de ${shortDescription} al carrito porque solo quedan ${product.stock} unidades disponibles.`,
          });
        }
      } else {
        const newProduct = { ...product, quantity: 1 };
        this.cart.push(newProduct);
      }
  
      this.saveCart();
      this.cartSubject.next(this.cart);
      this.updateCartInfo();
    }

  decreaseQuantity(productId: string): void {
    const existingProduct = this.cart.find((p) => p.id === productId);
    if (existingProduct) {
      if (existingProduct.quantity >= 1) {
        existingProduct.quantity--;
      } else {
        this.removeProduct(productId);
      }
    }
    this.saveCart();
    this.cartSubject.next(this.cart);
    this.updateCartInfo();
  }

  addToCartById(productId: string): void {
    const product = this.cart.find((p) => p.id === productId);
    if (product && product.stock > product.quantity) {
      product.quantity++;
      this.saveCart();
      this.cartSubject.next(this.cart);
      this.updateCartInfo();
    }
  }

  removeProduct(productId: string): void {
    this.cart = this.cart.filter((p) => p.id !== productId);
    this.saveCart();
    this.cartSubject.next(this.cart);
    this.updateCartInfo();
  }

  clearCart(): void {
    this.cart = [];
    sessionStorage.removeItem('cart');
    this.cartSubject.next(this.cart);
    this.updateCartInfo();
  }

  private loadCart(): void {
    if (typeof window !== 'undefined') {
      const savedCart = sessionStorage.getItem('cart');
      if (savedCart) {
        this.cart = JSON.parse(savedCart) as ProductInterface2[];
        this.cartSubject.next(this.cart);
        this.updateCartInfo();
      }
    }
  }


    getTotalPrice(discountCoupon: DiscountCoupon): number {
      let total: number = 0;
      if(discountCoupon.code == ""){
        this.cart.forEach(item =>{
          total = total + item.price * item.quantity;
        })
        
      }else{
        //console.log("ENTRA")
        total = this.discounCouponService.applyDiscount(this.cart, discountCoupon);

      }

      return total;
    }

  private saveCart(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.cart));
  }

  private updateCartInfo(): void {
    const totalQuantity = this.cart.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const totalStock = this.cart.length;
    this.cartQuantitySource.next(totalQuantity);
    this.cartStockSource.next(totalStock);
  }
}
