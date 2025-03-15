import { Component, EventEmitter, Output, output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';
import { ScreenTechnology } from '../../../models/products/characteristics/screen-technology';
import { TvCharacteristics } from '../../../interfaces/product/characteristics/tv-characteristics';
import { ScreenSize } from '../../../interfaces/product/characteristics/screen-size';
import { LengthUnit } from '../../../models/products/characteristics/length-unit';
import { Smart } from '../../../models/products/characteristics/smart';
import { GeneralCharacteristics } from '../../../interfaces/product/characteristics/general-characteristics';
import { Observable } from 'rxjs';
import { ProductInterface2 } from '../../../interfaces/product/product-interface2';
import { ProductService } from '../../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tv-characteristics',
  templateUrl: './tv-characteristics.component.html',
  styleUrl: './tv-characteristics.component.css',
})
export class TvCharacteristicsComponent {
  
  @Output() 
  characteristicsFormValid = new EventEmitter<boolean>();
  characteristicsFormGroup: FormGroup;

  screenTechnologiesList: string[];
  smartList: string[];

     /// PRODUCT EDIT  //////////////////////
    
     productoToEdit: ProductInterface2;
     id: string = "";
     //////////////////////
  

  constructor(
    private productCharacteristicsService: ProductcCharacteristicsService,
    private productService: ProductService, private route: ActivatedRoute

  ) {
   
    this.screenTechnologiesList =
      this.productCharacteristicsService.getScreenTechnology();
    this.smartList = this.productCharacteristicsService.getSmartList();
    this.characteristicsFormGroup = new FormGroup({
      screenTechnology: new FormControl(ScreenTechnology.AMOLED, [
        Validators.required,
      ]),
      screenInches: new FormControl('', [Validators.required]),
      smart: new FormControl(Smart.NO, [Validators.required]),
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
         this.setFormGroupToEdit(this.productoToEdit.characteristics as TvCharacteristics);
         
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
      size: form.get('screenInches')?.value,
      unit: LengthUnit.INCH,
    };

   

    let initCharact: GeneralCharacteristics =
      this.productCharacteristicsService.initCharacteristics();
    let charact: TvCharacteristics = {
      screenTechnology: form.get('screenTechnology')?.value,
      screenSize: sSize,
      smart: form.get('smart')?.value,
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

 setFormGroupToEdit(characteristics: TvCharacteristics){
   this.characteristicsFormGroup.get("screenTechnology")?.setValue(characteristics.screenTechnology);
   this.characteristicsFormGroup.get("screenInches")?.setValue(characteristics.screenSize.size);
   this.characteristicsFormGroup.get("smart")?.setValue(characteristics.smart);


 }
}
