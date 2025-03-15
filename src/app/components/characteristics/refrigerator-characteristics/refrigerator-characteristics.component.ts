import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';
import { CoolingSystem } from '../../../models/products/characteristics/cooling-system';
import { RefrigeratorCharacteristics } from '../../../interfaces/product/characteristics/refrigerator-characteristics';
import { GeneralCharacteristics } from '../../../interfaces/product/characteristics/general-characteristics';
import { Observable } from 'rxjs';
import { ProductInterface2 } from '../../../interfaces/product/product-interface2';
import { ProductService } from '../../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-refrigerator-characteristics',
  templateUrl: './refrigerator-characteristics.component.html',
  styleUrl: './refrigerator-characteristics.component.css'
})
export class RefrigeratorCharacteristicsComponent {

  
  @Output() 
  characteristicsFormValid = new EventEmitter<boolean>();
  characteristicsFormGroup: FormGroup;
  
  refrigeratorCoolingSystemList: string[];

     /// PRODUCT EDIT  //////////////////////
    
     productoToEdit: ProductInterface2;
     id: string = "";
     //////////////////////
  


  constructor(private productCharacteristicsService: ProductcCharacteristicsService,
    private productService: ProductService, private route: ActivatedRoute

  ){
  
  
    
    this.refrigeratorCoolingSystemList = this.productCharacteristicsService.getCoolingSystemList();
    this.characteristicsFormGroup = new FormGroup({
      "refrigeratorCoolingSystem": new FormControl(CoolingSystem.CICLE_DEFROST, [Validators.required])
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
         this.setFormGroupToEdit(this.productoToEdit.characteristics as RefrigeratorCharacteristics);
         
       },
       error: error =>{
         console.log("Error al buscar producto a editar")
       }
     });
   }
////////////////////////

    this.productCharacteristicsService.setCharacteristics(this.getCharacteristicsFromFormGroup(this.characteristicsFormGroup));

   
    this.productCharacteristicsService.setOnlyGeneralCharacteristics(false);
    this.formValid();

      this.characteristicsFormGroup.valueChanges.subscribe(//suscripción a los cambios del formulario
        form => {
        
        this.productCharacteristicsService.setCharacteristics(this.getCharacteristicsFromFormGroup(this.characteristicsFormGroup));
       
        
        this.formValid();
        }
      )
  }



   private getCharacteristicsFromFormGroup(form: FormGroup){
    
   

    let initCharact: GeneralCharacteristics =
          this.productCharacteristicsService.initCharacteristics();
        let charact: RefrigeratorCharacteristics = {
          coolingSystem: form.get("refrigeratorCoolingSystem")?.value,
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

 setFormGroupToEdit(characteristics: RefrigeratorCharacteristics){
   this.characteristicsFormGroup.get("refrigeratorCoolingSystem")?.setValue(characteristics.coolingSystem);

 }
}
