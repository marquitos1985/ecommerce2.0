import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product/product.service';
import { Category } from '../../../models/products/categories/category';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Brand } from '../../../models/products/brands/brand';
import Swal from 'sweetalert2';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';
import { Observable } from 'rxjs';
import { ProductInterface2 } from '../../../interfaces/product/product-interface2';
import { GeneralCharacteristics } from '../../../interfaces/product/characteristics/general-characteristics';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent implements OnInit{

  editProduct: FormGroup;
  categoryList: string[] = Object.values(Category).sort();
  brandList: string[] = Object.values(Brand).sort();
  product: ProductInterface2;
  id: string = "";
  
  
  @Output()
  generalCharacteristicsFormValid = new EventEmitter<boolean>();
  @Input()
  resetFormGroup: boolean = false; // input para reiniciar el formulario


  characteristicsFormValid: boolean = false;
  _generalCharacteristicsFormValid: boolean = false;

  generalCharacteristicsOnly: boolean = true;

  resetFormGeneralAndCharacteristics: boolean = false;


  constructor(private productService: ProductService , private route: ActivatedRoute, private productCharacteristicsService: ProductcCharacteristicsService, 
              private router: Router, private cdr: ChangeDetectorRef, private location: Location){
                
    this.editProduct = new FormGroup({
      brand: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      urlImage: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      price: new FormControl('', [Validators.required, Validators.min(0.01)]),
      stock: new FormControl('', [Validators.required, Validators.min(1)]),
      model: new FormControl("", [Validators.required]),
     
    });
    this.product = this.productService.initProductInterface();
  }

  ngOnInit(): void {
    let id;
    this.categoryList.splice(this.categoryList.indexOf(Category.NONE), 1);
    this.brandList.splice(this.brandList.indexOf(Brand.NONE), 1);

    
    id = this.route.snapshot.paramMap.get("id");
    
      if(id != null){
        this.id = id;
        this.getProductoToEdit(this.id).subscribe({
          next: response =>{
            this.product = response;
            this.setFormGroupToEdit(this.product);

          },
          error: error =>{
            console.log("Error al buscar producto a editar")
          }
        });
      }


      
  }

  onSubmit(){


    let newProduct: ProductInterface2 =  this.createProductFromData(this.editProduct, this.productCharacteristicsService.getFinalCharacteristics());
    newProduct.id = this.product.id;
    let productsList = undefined;
    let p = undefined;
    

this.productService.getAllProducts().subscribe({//para verificar si ya existe el producto
      next: response =>{
        
        productsList = response;

        if (productsList != undefined) {

            //Busca el mismo producto en otras categorias (distinto id)
            p = productsList.find(
              (prod) =>
                newProduct.brand === prod.brand && newProduct.model === prod.model && newProduct.id !== prod.id
            );


          
          
          if (p == undefined) {//si p es undefined => no existe el prodcucto

            this.editAlert(newProduct)
      .then((result) => {
        if (result.isConfirmed) {
          
          this.productService._updateProduct(newProduct).subscribe({
            next: response =>{
              Swal.fire({
                title: "",
                text: "Cambios realizados con éxito",
                icon: "success"
              });
            },
            error: error =>{
              Swal.fire({
                title: "",
                text: "El cambio no se pudo realizar",
                icon: "error"
              });
            }
          });


        }
      })
      .catch(error => {
        this.notEditAlert("Error al intentar modificar producto")
      });

          }else{
            
            
            this.notEditAlert("Producto ya existente en otra categoría...");

          }
        }else{
          
          this.notEditAlert("Sin productos");
        }

      },
      error: error =>{
        
        console.log(error);
        this.notEditAlert("Error al verificar existencia del producto...");
      }
    });












    if(this.product != null){
      this.editAlert(newProduct)
      .then((result) => {
        if (result.isConfirmed) {
          
          this.productService._updateProduct(newProduct).subscribe({
            next: response =>{
              Swal.fire({
                title: "",
                text: "Cambios realizados con éxito",
                icon: "success"
              });
            },
            error: error =>{
              Swal.fire({
                title: "",
                text: "El cambio no se pudo realizar",
                icon: "error"
              });
            }
          });


        }
      })
      .catch(error => {
        this.notEditAlert("Error al intentar modificar producto")
      });

    
  }

    
  }
  resetForm(){
    this.editProduct.reset();
    this.resetFormGeneralAndCharacteristics = true;
  }

  deleteProduct(id: string | undefined){
    
    this.deleteAlert(this.product)
    .then((result) => {
      if (result.isConfirmed) {
        if(this.product != null){
          this.productService._deleteProduct(this.product).subscribe({
            next: response =>{
              Swal.fire({
                title: "",
                text: "Eliminado con éxito",
                icon: "success"
              });
              this.router.navigateByUrl("/home");
            },
            error: error =>{
              Swal.fire({
                title: "",
                text: "No se pudo eliminar",
                icon: "error"
              });
            }
          });
        }
        
        


        
      }
    })
    .catch(error => {
      alert("Error al intentar eliminar producto")
    });
  }

  

  editAlert(product: ProductInterface2){
    
    const message = `
                    <strong>ID:</strong> ${product.id}<br>
                    <strong>Categoría:</strong> ${product.category}<br>
                    <strong>Marca:</strong> ${product.brand}<br>
                    <strong>Modelo:</strong> ${product.model}<br>
                    <strong>Descripción:</strong> ${product.description}<br>
                    <strong>Precio:</strong> $${product.price}<br>
                    <strong>Stock:</strong> ${product.stock}`;
            
            
    
    return Swal.fire({
      title: "Modificación a realizar",
      html: message,
      width: 1000,
      imageUrl: product.urlImage,
      imageHeight: 200,
      imageAlt: "A tall image",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    });
  }


  notEditAlert(message: string){
        Swal.fire({
          title: "Error",
          html: message,
          width: 1000,
          icon: "warning",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Aceptar"
        });
        
      }

  deleteAlert(product: ProductInterface2 | null){
    const message = `
                    <strong>ID:</strong> ${product?.id}<br>
                    <strong>Categoría:</strong> ${product?.category}<br>
                    <strong>Marca:</strong> ${product?.brand}<br>
                    <strong>Modelo:</strong> ${product?.model}<br>
                    <strong>Descripción:</strong> ${product?.description}<br>
                    <strong>Precio:</strong> $${product?.price}<br>
                    <strong>Stock:</strong> ${product?.stock}`;
            
            
            
   
    return Swal.fire({
      title: "Eliminar producto?",
      html: message,
      width: 1000,
      imageUrl: product?.urlImage,
      imageHeight: 200,
      imageAlt: "A tall image",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    });
  }


  

  getProductoToEdit(id: string):Observable<ProductInterface2>{
        return this.productService._getProductById(id);
        
      }
 
      setFormGroupToEdit(product: ProductInterface2){//Setea el formGroup con los datos del producto a editar

        this.editProduct.get("category")?.setValue(product.category);
        this.editProduct.get("brand")?.setValue(product.brand);
        this.editProduct.get("urlImage")?.setValue(product.urlImage);
        this.editProduct.get("description")?.setValue(product.description);
        this.editProduct.get("price")?.setValue(product.price);
        this.editProduct.get("stock")?.setValue(product.stock);
        this.editProduct.get("model")?.setValue(product.model);

        
      }


      set_GeneralCharacteristicsFormValid(event: boolean){//toma el output de GEenralcharacteristics para ver si es válido
    
        this._generalCharacteristicsFormValid = event;
        this.cdr.detectChanges(); 
      }
      setCharacteristicsFormValid(event: boolean){//toma el output de las caracteristicas para ver si es válido
    
        this.characteristicsFormValid = event;
        this.cdr.detectChanges(); 
      }

      private setGeneralCharacteristicsOnly(){// setea el characteristicsFormValid en falso por si ya viene true para la activación del botón crear prodcuto
        this.generalCharacteristicsOnly = false;
        switch (this.editProduct.get("category")?.value){
          case Category.ASPIRADORAS:
            this.generalCharacteristicsOnly = true;
            this.characteristicsFormValid = false;
            break;
            case Category.COMPUTADORAS_ESCRITORIO:
              this.generalCharacteristicsOnly = true;
              this.characteristicsFormValid = false;
            break;
            case Category.PARLANTES:
              this.generalCharacteristicsOnly = true;
              this.characteristicsFormValid = false;
            break;
        }
      }

      private createProductFromData(form: FormGroup, characteristics: GeneralCharacteristics){//toma el fomulario de create y las caracteristicas y crea el producto
          let product: ProductInterface2 = {
            id: "",
            brand: form.get("brand")?.value,
            category: form.get("category")?.value,
            urlImage: form.get("urlImage")?.value,
            description: form.get("description")?.value,
            price: Number(form.get("price")?.value),
            stock: Number(form.get("stock")?.value),
            model: form.get("model")?.value,
            quantity: 0,
            characteristics: characteristics
      
          }
          return product;
        }

        goBack(): void {
          this.location.back();
        }
}
