import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { ProductInterface } from '../interfaces/product/product-interface';
import { Observable } from 'rxjs';
import { ProductInterface2 } from '../interfaces/product/product-interface2';

@Injectable({
  providedIn: 'root',
})
export class AsyncService {
  constructor(private http: HttpClient) {}


  updateProduct(productId: string, product: ProductInterface, urlApi: string): Observable<ProductInterface>{
    const httpOptions = {
      headers: new HttpHeaders({'content-Type': 'application/json'}),
    };
    const { id, ...productWithoutId } = product;
    return this.http.put<ProductInterface>(urlApi + "/" + productId, productWithoutId, httpOptions);
  }

  deleteProduct(id: string, urlApi: string): Observable<ProductInterface>{
    return this.http.delete<ProductInterface>(urlApi + "/" + id);
  }

  
  getAll(urlApi: string): Observable<ProductInterface2[]> {
    return this.http.get<ProductInterface2[]>(urlApi); 
  }


  addProduct(product: ProductInterface2,urlApi: string): Observable<ProductInterface2> {
    const httpOptions = {
      headers: new HttpHeaders({'content-Type': 'application/json'}),
    };

    const { id, ...productWithoutId } = product;//producto sin id para q json server lo genere automaticamente

    return this.http.post<ProductInterface2>(urlApi, productWithoutId, httpOptions);
  }

  getProductById(productId: string, urlApi: string): Observable<ProductInterface2> {
    return this.http.get<ProductInterface2>(urlApi + "/" + productId);
  }
  _deleteProduct(id: string, urlApi: string): Observable<ProductInterface2>{
    return this.http.delete<ProductInterface2>(urlApi + "/" + id);
  }

  _updateProduct(productId: string, product: ProductInterface2, urlApi: string): Observable<ProductInterface2>{
    const httpOptions = {
      headers: new HttpHeaders({'content-Type': 'application/json'}),
    };
    const { id, ...productWithoutId } = product;
    return this.http.put<ProductInterface2>(urlApi + "/" + productId, productWithoutId, httpOptions);
  }



}
