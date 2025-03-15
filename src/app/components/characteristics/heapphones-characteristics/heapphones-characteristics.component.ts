import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';
import { HeadphoneType } from '../../../models/products/characteristics/headphone-type';
import { HeadphoneCharacteristics } from '../../../interfaces/product/characteristics/headphone-characteristics';
import { GeneralCharacteristics } from '../../../interfaces/product/characteristics/general-characteristics';
import { Observable } from 'rxjs';
import { ProductInterface2 } from '../../../interfaces/product/product-interface2';
import { ProductService } from '../../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';
import { Conectivity } from '../../../models/products/characteristics/conectivity';

@Component({
  selector: 'app-heapphones-characteristics',
  templateUrl: './heapphones-characteristics.component.html',
  styleUrl: './heapphones-characteristics.component.css',
})
export class HeapphonesCharacteristicsComponent {
  @Output() 
  characteristicsFormValid = new EventEmitter<boolean>();
  characteristicsFormGroup: FormGroup;

  hedphonesTypeList: string[];
  conectivityTypeList: string[];

     /// PRODUCT EDIT  //////////////////////
    
     productoToEdit: ProductInterface2;
     id: string = "";
     //////////////////////

  constructor(
    private productCharacteristicsService: ProductcCharacteristicsService,
    private productService: ProductService, private route: ActivatedRoute
  ) {
  
    this.hedphonesTypeList =
      this.productCharacteristicsService.getHeadphonesTypeList();
      this.conectivityTypeList = this.productCharacteristicsService.getConnectivityTypeList();
    this.characteristicsFormGroup = new FormGroup({
      headphoneType: new FormControl(HeadphoneType.HEAD_BAND, [
        Validators.required,
      ]),
      conectivity: new FormControl(Conectivity.BLUETOOTH, [
        Validators.required,
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
     this.getProductoToEdit(id).subscribe({//busdcar el producto si es para editar y extrae las carcteristicas y las cargar en el formulario
       next: response =>{
         this.productoToEdit = response;
         this.setFormGroupToEdit(this.productoToEdit.characteristics as HeadphoneCharacteristics);
         
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

 

  /////  AGREGADO  ///////
  private getCharacteristicsFromFormGroup(form: FormGroup) {
    

    let initCharact: GeneralCharacteristics =
      this.productCharacteristicsService.initCharacteristics();
    let charact: HeadphoneCharacteristics = {
      headphoneType: form.get('headphoneType')?.value,
      conectivity: form.get('conectivity')?.value,
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

 setFormGroupToEdit(characteristics: HeadphoneCharacteristics){
   this.characteristicsFormGroup.get("headphoneType")?.setValue(characteristics.headphoneType);
   this.characteristicsFormGroup.get("conectivity")?.setValue(characteristics.conectivity);

 }

}
