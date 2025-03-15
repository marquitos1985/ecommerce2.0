import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/product/product.service';
import { CarritoService } from '../../../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../services/login/auth.service';
import { ProductInterface2 } from '../../../../interfaces/product/product-interface2';
import { response } from 'express';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  productToVievDetails: ProductInterface2 | null = null;
  private cartSubscription: Subscription = new Subscription();

  constructor(
    private productService: ProductService,
    private carritoService: CarritoService,
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
    let idProducto = this.route.snapshot.paramMap.get('id');
    if (idProducto) {
      this.productService
        ._getProductById(idProducto).subscribe({
          next: response =>{
            this.productToVievDetails = response;
          },
          error: error =>{
             console.log('Error al obtener producto', error)
          }
        });

    }

    this.cartSubscription = this.carritoService
      .getCartItems()
      .subscribe((cartItems) => {
        if (this.productToVievDetails) {
          const cartItem = cartItems.find(
            (item) => item.id === this.productToVievDetails?.id
          );
          if (cartItem) {
            this.productToVievDetails.quantity = cartItem.quantity;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }


  addToCart(product: ProductInterface2): void {
    
    this.carritoService.addToCart(product);
    
  }

  decreaseQuantity(productId: string): void {
    this.carritoService.decreaseQuantity(productId);
  }

  isLoggedIN(): boolean {
    return this.authService.isLoggedIn();
  }
  isAdmin() {
    return this.authService.isAdmin()
    
  }

  deleteProduct(id: string | undefined) {
    if(id != undefined){
      this.productService._getProductById(id).subscribe({
        next: (response) => {
          let product = response;
          this.deleteAlert(product)
            .then((result) => {
              if (result.isConfirmed) {
                if (product != null) {
                  this.productService._deleteProduct(product).subscribe({
                    next: (response) => {
                      Swal.fire({
                        title: '',
                        text: 'Eliminado con éxito',
                        icon: 'success',
                      });
                      this.router.navigateByUrl('/home');
                    },
                    error: (error) => {
                      Swal.fire({
                        title: '',
                        text: 'No se pudo eliminar',
                        icon: 'error',
                      });
                    },
                  });
                }
              }
            })
            .catch((error) => {
              alert('Error al intentar eliminar producto');
            });
        },
        error: (error) => {
          alert('Error al obtener producto por ID');
        },
      });
    }
      
    }

     deleteAlert(product: ProductInterface2 | null) {
        const message = `
                          <strong>ID:</strong> ${product?.id}<br>
                          <strong>Categoría:</strong> ${product?.category}<br>
                          <strong>Marca:</strong> ${product?.brand}<br>
                          <strong>Modelo:</strong> ${product?.model}<br>
                          <strong>Descripción:</strong> ${product?.description}<br>
                          <strong>Precio:</strong> $${product?.price}<br>
                          <strong>Stock:</strong> ${product?.stock}`;
    
        return Swal.fire({
          title: 'Eliminar producto?',
          html: message,
          width: 1000,
          imageUrl: product?.urlImage,
          imageHeight: 200,
          imageAlt: 'A tall image',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
        });
      }

}
