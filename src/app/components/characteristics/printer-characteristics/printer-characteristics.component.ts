import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';
import { PrinterType } from '../../../models/products/characteristics/printer-type';
import { PrinterCharacteristics } from '../../../interfaces/product/characteristics/printer-characteristics';
import { GeneralCharacteristics } from '../../../interfaces/product/characteristics/general-characteristics';
import { Observable } from 'rxjs';
import { ProductInterface2 } from '../../../interfaces/product/product-interface2';
import { ProductService } from '../../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-printer-characteristics',
  templateUrl: './printer-characteristics.component.html',
  styleUrl: './printer-characteristics.component.css',
})
export class PrinterCharacteristicsComponent {
  
  @Output() 
  characteristicsFormValid = new EventEmitter<boolean>();
  characteristicsFormGroup: FormGroup;
 
  printerTypeList: string[];

     /// PRODUCT EDIT  //////////////////////
    
     productoToEdit: ProductInterface2;
     id: string = "";
     //////////////////////
  

  constructor(
    private productCharacteristicsService: ProductcCharacteristicsService,
    private productService: ProductService, private route: ActivatedRoute

  ) {
   

    this.printerTypeList =
      this.productCharacteristicsService.getPrinterTypeList();
    this.characteristicsFormGroup = new FormGroup({
      printerType: new FormControl(PrinterType.COLOR, [Validators.required]),
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
         this.setFormGroupToEdit(this.productoToEdit.characteristics as PrinterCharacteristics);
         
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
    let charact: PrinterCharacteristics = {
      printerType: form.get('printerType')?.value,
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

 setFormGroupToEdit(characteristics: PrinterCharacteristics){
   this.characteristicsFormGroup.get("printerType")?.setValue(characteristics.printerType);



 }
}
