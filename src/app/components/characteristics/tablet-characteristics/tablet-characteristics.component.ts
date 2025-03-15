import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';
import { ScreenSize } from '../../../interfaces/product/characteristics/screen-size';
import { LengthUnit } from '../../../models/products/characteristics/length-unit';
import { TabletCharacteristics } from '../../../interfaces/product/characteristics/tablet-characteristics';
import { MemorySize } from '../../../interfaces/product/characteristics/memory-size';
import { MemoryUnit } from '../../../models/products/characteristics/memory-unit';
import { Color } from '../../../models/products/characteristics/color';
import { Country } from '../../../models/products/characteristics/country';
import { CustomValidators } from '../../../common/custom-validators';
import { GeneralCharacteristics } from '../../../interfaces/product/characteristics/general-characteristics';
import { Observable } from 'rxjs';
import { ProductInterface2 } from '../../../interfaces/product/product-interface2';
import { ProductService } from '../../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tablet-characteristics',
  templateUrl: './tablet-characteristics.component.html',
  styleUrl: './tablet-characteristics.component.css',
})
export class TabletCharacteristicsComponent {
  
  @Output() 
  characteristicsFormValid = new EventEmitter<boolean>();
  characteristicsFormGroup: FormGroup;
 /// PRODUCT EDIT  //////////////////////
    
 productoToEdit: ProductInterface2;
 id: string = "";
 //////////////////////




  memoryUnitList: string[];

  constructor(
    private productCharacteristicsService: ProductcCharacteristicsService,
    private productService: ProductService, private route: ActivatedRoute

  ) {
    
    this.memoryUnitList =
      this.productCharacteristicsService.getMemoryUnitList();
    this.characteristicsFormGroup = new FormGroup({
      tabletScreenSize: new FormControl('', [Validators.required]),
      tabletRam: new FormControl('', [
        Validators.required,
        CustomValidators.numbersOnly(),
      ]),
      tabletStorageSize: new FormControl('', [
        Validators.required,
        CustomValidators.numbersOnly(),
      ]),
      storageUnit: new FormControl(MemoryUnit.GB, [Validators.required]),
    });
    
/// PRODUCT EDIT  //////////////////////
 
 this.productoToEdit = this.productService.initProductInterface();/// carga un producto vacío para reemplazar y editar

  }

  ngOnInit(): void {
    

/// PRODUCT EDIT  //////////////////////
 let id = this.route.snapshot.paramMap.get("id");
 if(id != null){
   this.id = id;
   this.getProductoToEdit(id).subscribe({//busdcar el producto si es para editar y extrae las carcteristicas y las cargar en el formulario
     next: response =>{
       this.productoToEdit = response;
       this.setFormGroupToEdit(this.productoToEdit.characteristics as TabletCharacteristics);
       
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
      size: form.get('tabletScreenSize')?.value,
      unit: LengthUnit.INCH
    };
    let _ram: MemorySize = {
      size: Number(form.get('tabletRam')?.value),
      unit: MemoryUnit.GB
    };

    let _storageSize: MemorySize = {
      size: Number(form.get('tabletStorageSize')?.value),
      unit: form.get('storageUnit')?.value
    }

  
    let initCharact: GeneralCharacteristics =
      this.productCharacteristicsService.initCharacteristics();
    let charact: TabletCharacteristics = {
      screenSize: sSize,
      ram: _ram,
      storageSize: _storageSize,
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

setFormGroupToEdit(characteristics: TabletCharacteristics){
 this.characteristicsFormGroup.get("tabletScreenSize")?.setValue(characteristics.screenSize.size);
 this.characteristicsFormGroup.get("tabletRam")?.setValue(characteristics.ram.size);
 this.characteristicsFormGroup.get("tabletStorageSize")?.setValue(characteristics.storageSize.size);
 this.characteristicsFormGroup.get("storageUnit")?.setValue(characteristics.storageSize.unit);


}



}
