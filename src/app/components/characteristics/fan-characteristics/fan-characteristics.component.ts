import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';
import { FanType } from '../../../models/products/characteristics/fan-type';
import { FanCharacteristics } from '../../../interfaces/product/characteristics/fan-characteristics';
import { GeneralCharacteristics } from '../../../interfaces/product/characteristics/general-characteristics';
import { Observable } from 'rxjs';
import { ProductInterface2 } from '../../../interfaces/product/product-interface2';
import { ProductService } from '../../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fan-characteristics',
  templateUrl: './fan-characteristics.component.html',
  styleUrl: './fan-characteristics.component.css',
})
export class FanCharacteristicsComponent implements OnInit{
  @Output() 
  characteristicsFormValid = new EventEmitter<boolean>();
  characteristicsFormGroup: FormGroup;
  fanTypeList: string[];
  /// PRODUCT EDIT  //////////////////////
    
 productoToEdit: ProductInterface2;
 id: string = "";
 //////////////////////


  constructor(
    private productCharacteristicsService: ProductcCharacteristicsService,
    private productService: ProductService, private route: ActivatedRoute
  ) {
    
    this.fanTypeList = this.productCharacteristicsService.getFanTypeList();
    

    this.characteristicsFormGroup = new FormGroup({
      fanType: new FormControl(FanType.PIE, Validators.required),
    });
    /// PRODUCT EDIT  //////////////////////
 
 this.productoToEdit = this.productService.initProductInterface();/// carga un producto vacío para reemplazar y editar

  }

  ngOnInit(): void {

    /// PRODUCT EDIT  //////////////////////
 let id = this.route.snapshot.paramMap.get("id");
 if(id != null){
   this.id = id;
   this.getProductoToEdit(id).subscribe({//buscar el producto si es para editar y extrae las carcteristicas y las cargar en el formulario
     next: response =>{
       this.productoToEdit = response;
       this.setFormGroupToEdit(this.productoToEdit.characteristics as FanCharacteristics);
       
     },
     error: error =>{
       console.log("Error al buscar producto a editar")
     }
   });
 }
////////////////////////
    

    this.productCharacteristicsService.setCharacteristics(
      this.getCharacteristicsFromFormGroup(this.characteristicsFormGroup)
    );


    this.productCharacteristicsService.setOnlyGeneralCharacteristics(false);
    this.formValid();

    this.characteristicsFormGroup.valueChanges.subscribe(
      //suscripción a los cambios del formulario
      (form) => {
       
        this.productCharacteristicsService.setCharacteristics(
          this.getCharacteristicsFromFormGroup(this.characteristicsFormGroup)
        );
      
        this.formValid();
      }
    );
  }

 

  private getCharacteristicsFromFormGroup(form: FormGroup) {

    let initCharact: GeneralCharacteristics =
      this.productCharacteristicsService.initCharacteristics();
    let charact: FanCharacteristics = {
      fanType: form.get('fanType')?.value,
      color: initCharact.color,
      country: initCharact.country,
      dimension: initCharact.dimension,
      weight: initCharact.weight,
    };



    return charact;
  }



  
  formValid(){
    this.characteristicsFormValid.emit(this.characteristicsFormGroup.valid);
  }


/////   EDIT PRODUCT  ///////
getProductoToEdit(id: string):Observable<ProductInterface2>{
  return this.productService._getProductById(id);
 
 }
 
 setFormGroupToEdit(characteristics: FanCharacteristics){
  this.characteristicsFormGroup.get("fanType")?.setValue(characteristics.fanType);
  

 }



}


 




















