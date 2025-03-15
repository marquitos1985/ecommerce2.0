import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';
import { ScreenSize } from '../../../interfaces/product/characteristics/screen-size';
import { MemorySize } from '../../../interfaces/product/characteristics/memory-size';
import { MemoryUnit } from '../../../models/products/characteristics/memory-unit';
import { SmartphoneCharacteristics } from '../../../interfaces/product/characteristics/smartphone-characteristics';
import { LengthUnit } from '../../../models/products/characteristics/length-unit';
import { CustomValidators } from '../../../common/custom-validators';
import { GeneralCharacteristics } from '../../../interfaces/product/characteristics/general-characteristics';
import { Observable } from 'rxjs';
import { ProductInterface2 } from '../../../interfaces/product/product-interface2';
import { ProductService } from '../../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-smartphones-characteristics',
  templateUrl: './smartphones-characteristics.component.html',
  styleUrl: './smartphones-characteristics.component.css',
})
export class SmartphonesCharacteristicsComponent {
  
  @Output() 
  characteristicsFormValid = new EventEmitter<boolean>();
  characteristicsFormGroup: FormGroup;
   /// PRODUCT EDIT  //////////////////////
    
 productoToEdit: ProductInterface2;
 id: string = "";
 //////////////////////


  constructor(
    private productCharacteristicsService: ProductcCharacteristicsService,
    private productService: ProductService, private route: ActivatedRoute

  ) {
 
    this.characteristicsFormGroup = new FormGroup({
      smartphoneInches: new FormControl('', [Validators.required]),
      smartphoneRam: new FormControl('', [
        Validators.required,
        CustomValidators.numbersOnly(),
      ]),
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
       this.setFormGroupToEdit(this.productoToEdit.characteristics as SmartphoneCharacteristics);
       
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
    let sSize: ScreenSize = {
      size: form.get('smartphoneInches')?.value,
      unit: LengthUnit.INCH,
    };
    let _ram: MemorySize = {
      size: Number(form.get('smartphoneRam')?.value),
      unit: MemoryUnit.GB,
    };

   
    let initCharact: GeneralCharacteristics =
      this.productCharacteristicsService.initCharacteristics();
    let charact: SmartphoneCharacteristics = {
      screenSize: sSize,
      ram: _ram,
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

setFormGroupToEdit(characteristics: SmartphoneCharacteristics){
 this.characteristicsFormGroup.get("smartphoneInches")?.setValue(characteristics.screenSize.size);
 this.characteristicsFormGroup.get("smartphoneRam")?.setValue(characteristics.ram.size);



}


}
