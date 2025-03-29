import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Purchase } from '../../models/purchases/purchase';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  //private apiUrl = 'http://localhost:3002/purchases';
  private apiUrl = 'http://localhost:8080/inventario-app/purchases';

  constructor(private http: HttpClient) {}

  agregarCompra(compra: Purchase): Observable<Purchase> {
    return this.http.post<Purchase>(this.apiUrl + "/add", compra);
  }
  obtenerComprasPorCliente(clienteId: string): Observable<Purchase[]> {
    //const url = `${this.apiUrl}?clienteId=${clienteId}`;
    const url = this.apiUrl + "/userId/" + clienteId;
    return this.http.get<Purchase[]>(url);
  }
  obtenerUltimoId(): Observable<number> {
    return this.http.get<Purchase[]>(this.apiUrl).pipe(
      map((compras: Purchase[]) => {
        if (compras.length === 0) {
          return 0;
        }
        const ultimaCompra = compras.sort((a, b) => Number(b.purchaseId) - Number(a.purchaseId))[0];
        return Number(ultimaCompra.purchaseId); 
      })
    );
  }
  
}
