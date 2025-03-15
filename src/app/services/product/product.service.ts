import { Injectable } from '@angular/core';
import { AsyncService } from '../async.service';
import { Brand } from '../../models/products/brands/brand';
import { Category } from '../../models/products/categories/category';
import { ProductInterface } from '../../interfaces/product/product-interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProductInterface2 } from '../../interfaces/product/product-interface2';
import { ProductcCharacteristicsService } from './product-characteristics.service';
import { FanType } from '../../models/products/characteristics/fan-type';
import { AirType } from '../../models/products/characteristics/air-type';
import { HeatCold } from '../../models/products/characteristics/heat-cold';
import { Conectivity } from '../../models/products/characteristics/conectivity';
import { Processor } from '../../models/products/characteristics/processor';
import { CoolingSystem } from '../../models/products/characteristics/cooling-system';
import { PrinterType } from '../../models/products/characteristics/printer-type';
import { HeadphoneType } from '../../models/products/characteristics/headphone-type';
import { ScreenTechnology } from '../../models/products/characteristics/screen-technology';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private _productsApiUrl = 'http://localhost:3010/_products';

 
  private airTypesList: string[] = Object.values(AirType).sort();
  private heatColdList: string[] = Object.values(HeatCold).sort();
  private fanTypeList: string[] = Object.values(FanType).sort();

  private processorsList: string[] = Object.values(Processor).sort();


  private screenTechnologiesList: string[] = Object.values(ScreenTechnology).sort();

  private headphonesTypeList = Object.values(HeadphoneType).sort();

  private coolingSystemList: string[] = Object.values(CoolingSystem).sort();

  private printerTypeList: string[] = Object.values(PrinterType).sort();
 
  private connectivityTypeList: string[] = Object.values(Conectivity).sort();

  constructor(private asyncService: AsyncService, private http: HttpClient, private productCharacteristicsService: ProductcCharacteristicsService) {
    
  }



  public getAllProductsListInterface2(): Observable<ProductInterface2[]> {
    return this.asyncService.getAll(this._productsApiUrl);
    
  }
  
  updateProductStock(productId: string, quantitySold: number): void {
    this._getProductById(productId).subscribe(product => {
      if (!product) {
        console.error(`No se encontró el producto con ID ${productId}`);
        return;
      }
  
      const updatedStock = product.stock - quantitySold;
      if (updatedStock < 0) {
        console.error(`No hay suficiente stock para el producto ${productId}`);
        return;
      }
  
      this.http.patch(`${this._productsApiUrl}/${productId}`, { stock: updatedStock }).subscribe(
        () => console.log(`Stock actualizado para el producto ${productId}`),
        (error) => console.error(`Error al actualizar el stock para ${productId}`, error)
      );
    });
  }
  

  
 
  getCharacteristicsList(type: string): string[] {
    let out: string[] = [];
    switch (type) {
      case 'airTypes':
        out = this.airTypesList;
        break;
      case 'heatCold':
        out = this.heatColdList;
        break;
      case 'fanType':
        out = this.fanTypeList;
        break;
      case 'headphoneType':
        out = this.headphonesTypeList;
        break;
      case 'printerType':
        out = this.printerTypeList;
        break;
      case 'coolingSystem':
        out = this.coolingSystemList;
        break;
      case 'screenTechnology':
        out = this.screenTechnologiesList;
        break;
      case 'connectivity':
        out = this.connectivityTypeList;
        break;
      case 'processor':
          out = this.processorsList;
              break;
    }
    return out;
  }
  



  getAllProducts(): Observable<ProductInterface2[]> {
      return this.asyncService.getAll(this._productsApiUrl); 
    }
  
  
    addProduct(product: ProductInterface2): Observable<ProductInterface2> {
      return this.asyncService.addProduct(product, this._productsApiUrl);
    }
  
    _getProductById(productId: string): Observable<ProductInterface2> {
      return this.asyncService.getProductById(productId, this._productsApiUrl);
    }

  
    _productExists(product: ProductInterface): boolean {
      let productsInterfaceList: ProductInterface2[] | undefined = [];
      let out = false;
      let p: ProductInterface2 | undefined;
  
      this.getAllProducts().subscribe({
        next: response =>{
          productsInterfaceList = response;
  
          if (productsInterfaceList != undefined) {
            p = productsInterfaceList.find(
              (prod) =>
                product.brand === prod.brand && product.model === prod.model
            );
            
            if (p != undefined) {
              out = true;
            }
          }





        },
        error: error =>{
          console.log("Error al verificar existencia del producto...");
          console.log(error);
        }
      });

  
      
      return out;
    }




    public initProductInterface(){//crea un producto vacío
  
      let product: ProductInterface2 = {
        
            id: "",
              brand: Brand.NONE,
              category: Category.NONE,
              urlImage: "",
              description: "",
              price: 0,
              stock: 0,
              characteristics: this.productCharacteristicsService.initCharacteristics(),
              model: "",
              quantity: 0
        
      }
      return product;
    }

    public _deleteProduct(product: ProductInterface2): Observable<ProductInterface2>{
      return this.asyncService._deleteProduct(product.id, this._productsApiUrl);
    }

    public _updateProduct(product: ProductInterface2): Observable<ProductInterface2>{
      return this.asyncService._updateProduct(product.id, product, this._productsApiUrl);
    }


}
