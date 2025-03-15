import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/product/product.service';
import { Brand } from '../../../../models/products/brands/brand';
import { Category } from '../../../../models/products/categories/category';

import { Subscription } from 'rxjs';
import { AuthService } from '../../../../services/login/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductInterface2 } from '../../../../interfaces/product/product-interface2';

import { AirConditioningCharacteristics } from '../../../../interfaces/product/characteristics/air-conditioning-characteristics';
import { FanCharacteristics } from '../../../../interfaces/product/characteristics/fan-characteristics';
import { TvCharacteristics } from '../../../../interfaces/product/characteristics/tv-characteristics';
import { HeadphoneCharacteristics } from '../../../../interfaces/product/characteristics/headphone-characteristics';
import { RefrigeratorCharacteristics } from '../../../../interfaces/product/characteristics/refrigerator-characteristics';
import { WashingCharacteristics } from '../../../../interfaces/product/characteristics/washing-characteristics';
import { NotebookCharacteristics } from '../../../../interfaces/product/characteristics/notebook-characteristics';
import { MicrowaveCharacteristics } from '../../../../interfaces/product/characteristics/microwave-characteristics';
import { SmartphoneCharacteristics } from '../../../../interfaces/product/characteristics/smartphone-characteristics';
import { TabletCharacteristics } from '../../../../interfaces/product/characteristics/tablet-characteristics';
import { PrinterCharacteristics } from '../../../../interfaces/product/characteristics/printer-characteristics';
import { KeyboardCharacteristics } from '../../../../interfaces/product/characteristics/keyboard-characteristics';
import { MouseCharacteristics } from '../../../../interfaces/product/characteristics/mouse-characteristics';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css',
})
export class ViewProductComponent implements OnInit, OnDestroy {
  formControlCategory: FormControl;
  formGrupSubfilters: FormGroup;
  currentPage: number = 1;        
  itemsPerPage: number = 10; 
  

  valueChangesSubscription?: Subscription;
  valueChangesformGrupSubfiltersSubscription?: Subscription;

  categoryList: string[] = [];
  brandList: string[] = [];
  screenTechnologiesList: string[] = [];
  airTypesList: string[] = [];
  heatColdList: string[] = [];
  fanTypeList: string[] = [];
  headphonesTypeList: string[] = [];
  coolingSystemList: string[] = [];
  volumeCapacityList: string[] = [];
  printerTypeList: string[] = [];
  connectivityTypeList: string[] = [];
  screenSizeList: string[] = [];
  ramList: string[] = [];
  storageSizeList: string[] = [];
  processorsList: string[] = [];
  weightCapacityList: string[] = [];

  noProducts = false;

  private all = 'Todos';

  private totalProductList: ProductInterface2[] = [];
  _productListFilteredByCategory: ProductInterface2[] = [];
  _productListSubFiltered: ProductInterface2[] = [];

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {
    this.formControlCategory = new FormControl('');
    this.formGrupSubfilters = new FormGroup({
      brand: new FormControl(''),
      orderByPrice: new FormControl(''),
      airTypes: new FormControl(''),
      heatCold: new FormControl(''),
      fanType: new FormControl(''),
      screenTechnology: new FormControl(''),
      headphoneType: new FormControl(''),
      coolingSystem: new FormControl(''),
      weightCapacity: new FormControl(''),
      volumeCapacity: new FormControl(''),
      printerType: new FormControl(''),
      connectivity: new FormControl(''),
      screenSize: new FormControl(''),
      ram: new FormControl(''),
      storageSize: new FormControl(''),
      processor: new FormControl(''),
    });

    this.categoryList = Object.values(Category).sort();
    this.screenTechnologiesList =
      this.productService.getCharacteristicsList('screenTechnology');
    this.addAllToList(this.screenTechnologiesList);

    this.airTypesList = this.productService.getCharacteristicsList('airTypes');
    this.addAllToList(this.airTypesList);

    this.heatColdList = this.productService.getCharacteristicsList('heatCold');
    this.addAllToList(this.heatColdList);

    this.fanTypeList = this.productService.getCharacteristicsList('fanType');
    this.addAllToList(this.fanTypeList);

    this.headphonesTypeList =
      this.productService.getCharacteristicsList('headphoneType');
    this.addAllToList(this.headphonesTypeList);

    this.coolingSystemList =
      this.productService.getCharacteristicsList('coolingSystem');
    this.addAllToList(this.coolingSystemList);

    this.printerTypeList =
      this.productService.getCharacteristicsList('printerType');
    this.addAllToList(this.printerTypeList);

    this.connectivityTypeList =
      this.productService.getCharacteristicsList('connectivity');
    this.addAllToList(this.connectivityTypeList);

    this.processorsList =
      this.productService.getCharacteristicsList('processor');
    this.addAllToList(this.processorsList);

    this.categoryList.splice(this.categoryList.indexOf(Category.NONE), 1);
  }

  ngOnInit() {
    this.noProducts = false; // setea en falso el cartel de sin productos

    this.getTotalProduclist().subscribe({
      next: (response) => {
        this.totalProductList = response;

        this._productListFilteredByCategory = this.totalProductList; //carga la lista de productos de categoria con todos los productos

        //setea el estado inicial de lo subfiltros
        this.setInitialSubFiltersOfListProductsInterface(
          this._productListFilteredByCategory
        );

        //Asignar lista a mostrar
        this._productListSubFiltered = this._productListFilteredByCategory; // está sin subfiltros aplicados pero es lo q tiene q mostrar inicialmente
      },
      error: (error) => {
        console.log('Error al obtener todos los productos...' + error);
      },
    });

    //suscribe a los cambios de valor de la categoría
    this.valueChangesSubscription =
      this.formControlCategory.valueChanges.subscribe((form) => {
        // setea en falso el cartel de sin productos
        this.noProducts = false;
        this.currentPage = 1;
        this.getTotalProduclist().subscribe({
          next: (response) => {
            this.totalProductList = response;

            //filtra la lista total con la categoria
            this._productListFilteredByCategory =
              this.getListFilteredByCategory(
                this.totalProductList,
                this.formControlCategory.value
              );

            //Carga las listas de los subfiltros a partir de los productos de la categoria
            this.loadSubfiltersLists(
              this._productListFilteredByCategory,
              this.formControlCategory.value,
              this.formGrupSubfilters
            );

            //setea el estado inicial de lo subfiltros
            this.setInitialSubFiltersOfListProductsInterface(
              this._productListFilteredByCategory
            );

            //Asignar lista a mostrar
            this._productListSubFiltered = this._productListFilteredByCategory; // está sin subfiltros aplicados pero es lo q tiene q mostrar inicialmente
          },
          error: (error) => {
            console.log('Error al obtener todos los productos...' + error);
          },
        });
      });

    this.valueChangesformGrupSubfiltersSubscription =
      this.formGrupSubfilters.valueChanges.subscribe((form) => {
        //Obtiene la lista subfiltrada a partir de la lista por categoria seleccionada
        this.currentPage = 1;
        this._productListSubFiltered = this.getListFilteredBySubFilters(
          this._productListFilteredByCategory,
          this.formGrupSubfilters,
          this.formControlCategory.value
        );
        //si la lista está vacia habilita el cartel de sin productos
        if (this._productListSubFiltered.length == 0) {
          this.noProducts = true;
        }
      });
  }

  ngOnDestroy(): void {
    this.valueChangesSubscription?.unsubscribe();
    this.valueChangesformGrupSubfiltersSubscription?.unsubscribe();
  }

  getTotalProduclist() {
    return this.productService.getAllProducts();
  }

  //filtra la lista total con la categoria
  getListFilteredByCategory(
    totalProductList: ProductInterface2[],
    category: string
  ) {
    let filteredProductsList: ProductInterface2[] = totalProductList;

    //none está cargado iniciamente en el formControl. Si está así, no muestra nada
    if (category != Category.NONE) {
      //filtro categoria
      if (category != Category.ALL) {
        filteredProductsList = this.getFilterByCategory(
          filteredProductsList,
          category
        );
      }
    }
    return filteredProductsList;
  }

  //retorna la lista filtrada por categoria
  private getFilterByCategory(
    productsList: ProductInterface2[],
    category: string
  ): ProductInterface2[] {
    return productsList.filter((product) => product.category === category);
  }

  //setea el estado inicial de lo subfiltros
  private setInitialSubFiltersOfListProductsInterface(
    productsList: ProductInterface2[]
  ) {
    this.brandList = this.obtainBrandListFilteredByCategory(productsList); // obtiene las marcas de los productos filtrados

    this.formGrupSubfilters.get('brand')?.setValue(this.all);
    this.formGrupSubfilters.get('orderByPrice')?.setValue('');
    this.formGrupSubfilters.get('airTypes')?.setValue(this.all);
    this.formGrupSubfilters.get('heatCold')?.setValue(this.all);
    this.formGrupSubfilters.get('fanType')?.setValue(this.all);
    this.formGrupSubfilters.get('screenTechnology')?.setValue(this.all);
    this.formGrupSubfilters.get('headphoneType')?.setValue(this.all);
    this.formGrupSubfilters.get('coolingSystem')?.setValue(this.all);
    this.formGrupSubfilters.get('volumeCapacity')?.setValue(this.all);
    this.formGrupSubfilters.get('printerType')?.setValue(this.all);
    this.formGrupSubfilters.get('connectivity')?.setValue(this.all);
    this.formGrupSubfilters.get('screenSize')?.setValue(this.all);
    this.formGrupSubfilters.get('ram')?.setValue(this.all);
    this.formGrupSubfilters.get('storageSize')?.setValue(this.all);
    this.formGrupSubfilters.get('processor')?.setValue(this.all);
    this.formGrupSubfilters.get('weightCapacity')?.setValue(this.all);
  }

  //devuelve las marcas existentes en la lista por categoria
  private obtainBrandListFilteredByCategory(productList: ProductInterface2[]) {
    let brandList: string[] = [];
    brandList.push(Brand.ALL);
    productList.forEach((product) => {
      if (!brandList.includes(product.brand)) {
        brandList.push(product.brand);
      }
    });
    return brandList;
  }

  //Obtiene la lista subfiltrada a partir de la lista por categoria seleccionada
  private getListFilteredBySubFilters(
    productListSubFilteredByCategory: ProductInterface2[],
    formGroup: FormGroup,
    category: string
  ) {
    let filteredProductsListInterface = productListSubFilteredByCategory;
    this.noProducts = false;

    //FILTRA POR MARCA
    if (
      formGroup.get('brand')?.value != Brand.NONE &&
      formGroup.get('brand')?.value != Brand.ALL
    ) {
      filteredProductsListInterface = this.getListFilteredByBrand(
        filteredProductsListInterface,
        formGroup.get('brand')?.value
      );
    }

    // FILTRA ORDENADO POR PRECIO
    if (formGroup.get('orderByPrice')?.value != '') {
      filteredProductsListInterface = this.getListOrderedByPrice(
        filteredProductsListInterface,
        formGroup.get('orderByPrice')?.value
      ).slice(0, 48);
    }

    //filtra a partir de la categoria y las caracteristicas de la categoria, utilizando los forms
    filteredProductsListInterface = this.getListFilteredCharacteristics(
      filteredProductsListInterface,
      category,
      formGroup
    );

    //Retorna lista a mostrar
    return filteredProductsListInterface;
  }

  //Filtra la lista por marca
  private getListFilteredByBrand(
    productsList: ProductInterface2[],
    brand: string
  ): ProductInterface2[] {
    // retorna una lista filtrada por marca
    return productsList.filter((product) => product.brand == brand);
  }

  //Ordena la lista por categoria
  private getListOrderedByPrice(
    productList: ProductInterface2[],
    mode: 'asc' | 'desc'
  ): ProductInterface2[] {
    // retorna una lista ordenada por precio
    productList.sort((a, b) => {
      return mode === 'asc' ? a.price - b.price : b.price - a.price;
    });
    return productList;
  }

  //Retorna la lista filtrada a partir de la categoria y los subfiltros
  private getListFilteredCharacteristics(
    productsList: ProductInterface2[],
    category: string,
    formGroup: FormGroup
  ): ProductInterface2[] {
    let filteredProductList: ProductInterface2[] = productsList;

    switch (category) {
      case Category.AIRE_ACONDICIONADO:
        if (
          formGroup.get('airTypes')?.value != '' &&
          formGroup.get('airTypes')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('airTypes')?.value ===
              (product.characteristics as AirConditioningCharacteristics)
                .airType
          );
        }
        if (
          formGroup.get('heatCold')?.value != '' &&
          formGroup.get('heatCold')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('heatCold')?.value ===
              (product.characteristics as AirConditioningCharacteristics)
                .heatCold
          );
        }
        break;
      case Category.AURICULARES:
        if (
          formGroup.get('connectivity')?.value != '' &&
          formGroup.get('connectivity')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('connectivity')?.value ===
              (product.characteristics as HeadphoneCharacteristics).conectivity
          );
        }

        if (
          formGroup.get('headphoneType')?.value != '' &&
          formGroup.get('headphoneType')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('headphoneType')?.value ===
              (product.characteristics as HeadphoneCharacteristics)
                .headphoneType
          );
        }

        break;
      case Category.MOUSES:
        if (
          formGroup.get('connectivity')?.value != '' &&
          formGroup.get('connectivity')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('connectivity')?.value ===
              (product.characteristics as MouseCharacteristics).conectivity
          );
        }

        break;
      case Category.TECLADOS:
        if (
          formGroup.get('connectivity')?.value != '' &&
          formGroup.get('connectivity')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('connectivity')?.value ===
              (product.characteristics as KeyboardCharacteristics).conectivity
          );
        }

        break;
      case Category.CELULARES:
        if (
          formGroup.get('screenSize')?.value != '' &&
          formGroup.get('screenSize')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('screenSize')?.value ===
              String(
                (product.characteristics as SmartphoneCharacteristics)
                  .screenSize.size
              ) +
                String(
                  (product.characteristics as SmartphoneCharacteristics)
                    .screenSize.unit
                )
          );
        }

        if (
          formGroup.get('ram')?.value != '' &&
          formGroup.get('ram')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('ram')?.value ===
              String(
                (product.characteristics as SmartphoneCharacteristics).ram.size
              ) +
                String(
                  (product.characteristics as SmartphoneCharacteristics).ram
                    .unit
                )
          );
        }
        break;
      case Category.HELADERAS:
        if (
          formGroup.get('coolingSystem')?.value != '' &&
          formGroup.get('coolingSystem')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('coolingSystem')?.value ===
              (product.characteristics as RefrigeratorCharacteristics)
                .coolingSystem
          );
        }
        break;
      case Category.IMPRESORAS:
        if (
          formGroup.get('printerType')?.value != '' &&
          formGroup.get('printerType')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('printerType')?.value ===
              (product.characteristics as PrinterCharacteristics).printerType
          );
        }
        break;
      case Category.LAVARROPAS:
        if (
          formGroup.get('weightCapacity')?.value != '' &&
          formGroup.get('weightCapacity')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('weightCapacity')?.value ===
              String(
                (product.characteristics as WashingCharacteristics)
                  .weightCapacity.weight
              ) +
                String(
                  (product.characteristics as WashingCharacteristics)
                    .weightCapacity.unit
                )
          );
        }
        break;
      case Category.MICROONDAS:
        if (
          formGroup.get('volumeCapacity')?.value != '' &&
          formGroup.get('volumeCapacity')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('volumeCapacity')?.value ===
              String(
                (product.characteristics as MicrowaveCharacteristics).capacity
                  .value
              ) +
                String(
                  (product.characteristics as MicrowaveCharacteristics).capacity
                    .unit
                )
          );
        }
        break;

      case Category.NOTEBOOKS:
        if (
          formGroup.get('screenSize')?.value != '' &&
          formGroup.get('screenSize')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('screenSize')?.value ===
              String(
                (product.characteristics as NotebookCharacteristics).screenSize
                  .size
              ) +
                String(
                  (product.characteristics as NotebookCharacteristics)
                    .screenSize.unit
                )
          );
        }

        if (
          formGroup.get('ram')?.value != '' &&
          formGroup.get('ram')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('ram')?.value ===
              String(
                (product.characteristics as NotebookCharacteristics).ram.size
              ) +
                String(
                  (product.characteristics as NotebookCharacteristics).ram.unit
                )
          );
        }

        if (
          formGroup.get('storageSize')?.value != '' &&
          formGroup.get('storageSize')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('storageSize')?.value ===
              String(
                (product.characteristics as NotebookCharacteristics).storageSize
                  .size
              ) +
                String(
                  (product.characteristics as NotebookCharacteristics)
                    .storageSize.unit
                )
          );
        }
        if (
          formGroup.get('processor')?.value != '' &&
          formGroup.get('processor')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('processor')?.value ===
              (product.characteristics as NotebookCharacteristics).processor
          );
        }
        break;

      case Category.TABLETS:
        if (
          formGroup.get('screenSize')?.value != '' &&
          formGroup.get('screenSize')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('screenSize')?.value ===
              String(
                (product.characteristics as NotebookCharacteristics).screenSize
                  .size
              ) +
                String(
                  (product.characteristics as NotebookCharacteristics)
                    .screenSize.unit
                )
          );
        }

        if (
          formGroup.get('ram')?.value != '' &&
          formGroup.get('ram')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('ram')?.value ===
              String(
                (product.characteristics as NotebookCharacteristics).ram.size
              ) +
                String(
                  (product.characteristics as NotebookCharacteristics).ram.unit
                )
          );
        }

        if (
          formGroup.get('storageSize')?.value != '' &&
          formGroup.get('storageSize')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('storageSize')?.value ===
              String(
                (product.characteristics as NotebookCharacteristics).storageSize
                  .size
              ) +
                String(
                  (product.characteristics as NotebookCharacteristics)
                    .storageSize.unit
                )
          );
        }

        break;

      case Category.TELEVISORES:
        if (
          formGroup.get('screenSize')?.value != '' &&
          formGroup.get('screenSize')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('screenSize')?.value ===
              String(
                (product.characteristics as TvCharacteristics).screenSize.size
              ) +
                String(
                  (product.characteristics as TvCharacteristics).screenSize.unit
                )
          );
        }

        if (
          formGroup.get('screenTechnology')?.value != '' &&
          formGroup.get('screenTechnology')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('screenTechnology')?.value ===
              (product.characteristics as TvCharacteristics).screenTechnology
          );
        }
        break;
      case Category.VENTILADOR:
        if (
          formGroup.get('fanType')?.value != '' &&
          formGroup.get('fanType')?.value != this.all
        ) {
          filteredProductList = filteredProductList.filter(
            (product) =>
              formGroup.get('fanType')?.value ===
              (product.characteristics as FanCharacteristics).fanType
          );
        }
        break;
    }

    return filteredProductList;
  }

  //////////////////////////////////  DELETE   //////////////////////////////////
  deleteProduct(id: string) {
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

  isAdmin() {
    return this.authService.isAdmin()
    
  }

  //Carga las listas de los subfiltros a partir de los productos de la categoria
  private loadSubfiltersLists(
    productList: ProductInterface2[],
    category: string,
    formGroup: FormGroup
  ) {
    // carga las listar de subfiltrado a partir de las litas de datos
    this.screenSizeList = [];
    this.ramList = [];
    this.storageSizeList = [];
    this.weightCapacityList = [];
    this.volumeCapacityList = [];

    this.screenSizeList.push(this.all);
    this.ramList.push(this.all);
    this.storageSizeList.push(this.all);
    this.weightCapacityList.push(this.all);
    this.volumeCapacityList.push(this.all);

    switch (category) {
      case Category.NOTEBOOKS:
        productList.forEach((product) => {
          let screenSize = String(
            (product.characteristics as NotebookCharacteristics).screenSize.size
          );
          let screenUnit = String(
            (product.characteristics as NotebookCharacteristics).screenSize.unit
          );

          let ramSize = String(
            (product.characteristics as NotebookCharacteristics).ram.size
          );
          let ramUnit = String(
            (product.characteristics as NotebookCharacteristics).ram.unit
          );

          let storageSize = String(
            (product.characteristics as NotebookCharacteristics).storageSize
              .size
          );
          let storageUnit = String(
            (product.characteristics as NotebookCharacteristics).storageSize
              .unit
          );

          if (!this.screenSizeList.includes(screenSize + screenUnit)) {
            this.screenSizeList.push(screenSize + screenUnit);
          }
          if (!this.ramList.includes(ramSize + ramUnit)) {
            this.ramList.push(ramSize + ramUnit);
          }

          if (!this.storageSizeList.includes(storageSize + storageUnit)) {
            this.storageSizeList.push(storageSize + storageUnit);
          }
        });

        break;
      case Category.TABLETS:
        productList.forEach((product) => {
          let screenSize = String(
            (product.characteristics as TabletCharacteristics).screenSize.size
          );
          let screenUnit = String(
            (product.characteristics as TabletCharacteristics).screenSize.unit
          );

          let ramSize = String(
            (product.characteristics as TabletCharacteristics).ram.size
          );
          let ramUnit = String(
            (product.characteristics as TabletCharacteristics).ram.unit
          );

          let storageSize = String(
            (product.characteristics as TabletCharacteristics).storageSize.size
          );
          let storageUnit = String(
            (product.characteristics as TabletCharacteristics).storageSize.unit
          );

          if (!this.screenSizeList.includes(screenSize + screenUnit)) {
            this.screenSizeList.push(screenSize + screenUnit);
          }
          if (!this.ramList.includes(ramSize + ramUnit)) {
            this.ramList.push(ramSize + ramUnit);
          }

          if (!this.storageSizeList.includes(storageSize + storageUnit)) {
            this.storageSizeList.push(storageSize + storageUnit);
          }
        });

        break;
      case Category.CELULARES:
        productList.forEach((product) => {
          let screenSize = String(
            (product.characteristics as SmartphoneCharacteristics).screenSize
              .size
          );
          let screenUnit = String(
            (product.characteristics as SmartphoneCharacteristics).screenSize
              .unit
          );

          let ramSize = String(
            (product.characteristics as SmartphoneCharacteristics).ram.size
          );
          let ramUnit = String(
            (product.characteristics as SmartphoneCharacteristics).ram.unit
          );

          if (!this.screenSizeList.includes(screenSize + screenUnit)) {
            this.screenSizeList.push(screenSize + screenUnit);
          }
          if (!this.ramList.includes(ramSize + ramUnit)) {
            this.ramList.push(ramSize + ramUnit);
          }
        });

        break;

      case Category.TELEVISORES:
        productList.forEach((product) => {
          let screenSize = String(
            (product.characteristics as SmartphoneCharacteristics).screenSize
              .size
          );
          let screenUnit = String(
            (product.characteristics as SmartphoneCharacteristics).screenSize
              .unit
          );

          if (!this.screenSizeList.includes(screenSize + screenUnit)) {
            this.screenSizeList.push(screenSize + screenUnit);
          }
        });

        break;

      case Category.LAVARROPAS:
        productList.forEach((product) => {
          let capacity = String(
            (product.characteristics as WashingCharacteristics).weightCapacity
              .weight
          );
          let capacityUnit = String(
            (product.characteristics as WashingCharacteristics).weightCapacity
              .unit
          );

          if (!this.weightCapacityList.includes(capacity + capacityUnit)) {
            this.weightCapacityList.push(capacity + capacityUnit);
          }
        });

        break;
      case Category.MICROONDAS:
        productList.forEach((product) => {
          let capacity = String(
            (product.characteristics as MicrowaveCharacteristics).capacity.value
          );
          let capacityUnit = String(
            (product.characteristics as MicrowaveCharacteristics).capacity.unit
          );

          if (!this.volumeCapacityList.includes(capacity + capacityUnit)) {
            this.volumeCapacityList.push(capacity + capacityUnit);
          }
        });

        break;
    }
  }

  //agrega Todos a la lista por parametro
  private addAllToList(list: string[]) {
    if (!list.includes(this.all)) {
      list.push(this.all);
    }
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
  }
  
}
