import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';
import { Processor } from '../../../models/products/characteristics/processor';
import { CustomValidators } from '../../../common/custom-validators';
import { ScreenSize } from '../../../interfaces/product/characteristics/screen-size';
import { MemorySize } from '../../../interfaces/product/characteristics/memory-size';
import { MemoryUnit } from '../../../models/products/characteristics/memory-unit';
import { LengthUnit } from '../../../models/products/characteristics/length-unit';
import { NotebookCharacteristics } from '../../../interfaces/product/characteristics/notebook-characteristics';
import { GeneralCharacteristics } from '../../../interfaces/product/characteristics/general-characteristics';
import { Observable } from 'rxjs';
import { ProductInterface2 } from '../../../interfaces/product/product-interface2';
import { ProductService } from '../../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notebooks-characteristics',
  templateUrl: './notebooks-characteristics.component.html',
  styleUrl: './notebooks-characteristics.component.css',
})
export class NotebooksCharacteristicsComponent {
 
  @Output() 
  characteristicsFormValid = new EventEmitter<boolean>();
  characteristicsFormGroup: FormGroup;
 
  notebookProcessorsList: string[];
  memoryUnitList: string[];

  
   /// PRODUCT EDIT  //////////////////////
    
   productoToEdit: ProductInterface2;
   id: string = "";
   //////////////////////

  constructor(
    private productCharacteristicsService: ProductcCharacteristicsService,
    private productService: ProductService, private route: ActivatedRoute

  ) {
    
    this.notebookProcessorsList =
      this.productCharacteristicsService.getProcessorsList();
    this.memoryUnitList =
      this.productCharacteristicsService.getMemoryUnitList();
    this.characteristicsFormGroup = new FormGroup({
      notebookScreenSize: new FormControl('', [Validators.required]),
      notebookRam: new FormControl('', [
        Validators.required,
        CustomValidators.numbersOnly(),
      ]),
      notebookProcessor: new FormControl(Processor.AMD_Ryzen_3, [
        Validators.required,
      ]),
      notebookStorageSize: new FormControl('', [
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
     this.getProductoToEdit(id).subscribe({//buscar el producto si es para editar y extrae las carcteristicas y las cargar en el formulario
       next: response =>{
         this.productoToEdit = response;
         this.setFormGroupToEdit(this.productoToEdit.characteristics as NotebookCharacteristics);
         
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
      size: Number(form.get('notebookScreenSize')?.value),
      unit: LengthUnit.INCH,
    };
    let _ram: MemorySize = {
      size: Number(form.get('notebookRam')?.value),
      unit: MemoryUnit.GB,
    };

    let _storage: MemorySize = {
      size: Number(form.get('notebookStorageSize')?.value),
      unit: form.get('storageUnit')?.value,
    };

  

    let initCharact: GeneralCharacteristics =
      this.productCharacteristicsService.initCharacteristics();
    let charact: NotebookCharacteristics = {
      screenSize: sSize,
      ram: _ram,
      processor: form.get('notebookProcessor')?.value,
      storageSize: _storage,
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

 setFormGroupToEdit(characteristics: NotebookCharacteristics){
   this.characteristicsFormGroup.get("notebookScreenSize")?.setValue(characteristics.screenSize.size);
   this.characteristicsFormGroup.get("notebookRam")?.setValue(characteristics.ram.size);
   this.characteristicsFormGroup.get("notebookProcessor")?.setValue(characteristics.processor);
   this.characteristicsFormGroup.get("notebookStorageSize")?.setValue(characteristics.storageSize.size);
   this.characteristicsFormGroup.get("storageUnit")?.setValue(characteristics.storageSize.unit);

 }
}
