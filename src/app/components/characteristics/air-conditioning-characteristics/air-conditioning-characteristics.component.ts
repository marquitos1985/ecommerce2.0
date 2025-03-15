import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';
import { AirConditioningCharacteristics } from '../../../interfaces/product/characteristics/air-conditioning-characteristics';
import { HeatCold } from '../../../models/products/characteristics/heat-cold';
import { AirType } from '../../../models/products/characteristics/air-type';
import { GeneralCharacteristics } from '../../../interfaces/product/characteristics/general-characteristics';
import { EventEmitter } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { ProductInterface2 } from '../../../interfaces/product/product-interface2';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-air-conditioning-characteristics',
  templateUrl: './air-conditioning-characteristics.component.html',
  styleUrl: './air-conditioning-characteristics.component.css',
})
export class AirConditioningCharacteristicsComponent implements OnInit {

  @Output() 
  characteristicsFormValid = new EventEmitter<boolean>();
  @Input()
  resetFormGroup: boolean = false;


  heatColdList: string[];
  airTypesList: string[];

  characteristicsFormGroup: FormGroup;

  /// PRODUCT EDIT  //////////////////////
    
  productoToEdit: ProductInterface2;
  id: string = "";
  //////////////////////
  

  constructor(
    private productCharacteristicsService: ProductcCharacteristicsService,
    private productService: ProductService, private route: ActivatedRoute
  ) {
    this.heatColdList = this.productCharacteristicsService.getHeatColdList();
    this.airTypesList = this.productCharacteristicsService.getAirTypeList();
    

    this.characteristicsFormGroup = new FormGroup({
      heatCold: new FormControl(HeatCold.Si, [Validators.required]),
      airTypes: new FormControl(AirType.Portatil, [Validators.required]),
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
          this.setFormGroupToEdit(this.productoToEdit.characteristics as AirConditioningCharacteristics);
          
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
    let charact: AirConditioningCharacteristics = {
      airType: form.get('airTypes')?.value,
      heatCold: form.get('heatCold')?.value,
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

  setFormGroupToEdit(characteristics: AirConditioningCharacteristics){
    this.characteristicsFormGroup.get("heatCold")?.setValue(characteristics.heatCold);
    this.characteristicsFormGroup.get("airTypes")?.setValue(characteristics.airType);

  }
  
}
