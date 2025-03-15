import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Color } from '../../models/products/characteristics/color';

import { Country } from '../../models/products/characteristics/country';
import { GeneralCharacteristics } from '../../interfaces/product/characteristics/general-characteristics';
import { AirType } from '../../models/products/characteristics/air-type';
import { HeatCold } from '../../models/products/characteristics/heat-cold';
import { FanType } from '../../models/products/characteristics/fan-type';
import { HeadphoneType } from '../../models/products/characteristics/headphone-type';
import { Conectivity } from '../../models/products/characteristics/conectivity';
import { PrinterType } from '../../models/products/characteristics/printer-type';
import { CoolingSystem } from '../../models/products/characteristics/cooling-system';
import { ScreenTechnology } from '../../models/products/characteristics/screen-technology';
import { Smart } from '../../models/products/characteristics/smart';
import { Processor } from '../../models/products/characteristics/processor';
import { MemoryUnit } from '../../models/products/characteristics/memory-unit';
import { Height } from '../../interfaces/product/characteristics/height';
import { LengthUnit } from '../../models/products/characteristics/length-unit';
import { Width } from '../../interfaces/product/characteristics/width';
import { Dimension } from '../../interfaces/product/characteristics/dimension';
import { Weight } from '../../interfaces/product/characteristics/weight';
import { WeightUnit } from '../../models/products/characteristics/weight-unit';
import { Depth } from '../../interfaces/product/characteristics/depth';

@Injectable({
  providedIn: 'root'
})
export class ProductcCharacteristicsService {
  characteristicsString: string = "";
  private onlyGeneralCharacteristics: boolean = false;
  ////// CARACTERITICAS GENERALES  /////

  private colorList = Object.values(Color).sort();
  private countryList = Object.values(Country).sort();

  ///// AIRE ACOINDICIONADO  //////
  private airTypeList: string[] = Object.values(AirType).sort();
  private heatColdList: string[] = Object.values(HeatCold).sort();

  ///// VENTILADORES  //////
  private fanTypeList: string[] = Object.values(FanType).sort();

  ///// HEADPHONES /////
  private headphonesTypeList:  string[] = Object.values(HeadphoneType).sort();

  ///// CONECTIVITY /////

  private connectivityTypeList: string[] = Object.values(Conectivity).sort();

  ////// PRINTER TYPE /////
  private printerTypeList: string[] = Object.values(PrinterType).sort();

////// REFRIGERATOR  //////
  private coolingSystemList: string[] = Object.values(CoolingSystem).sort();

  ///// SCREEN  /////
  private screenTechnology: string[] = Object.values(ScreenTechnology).sort();

  ///// TECHNOLOGY  /////////////////////
  private smartList: string[] = Object.values(Smart).sort();

  ///// PROCCESSORS //////
  private processorsList: string[] = Object.values(Processor).sort();

  ///// STORAGE /////
  private memoryUnitList: string[] = Object.values(MemoryUnit).sort();

  ////  WEIGHT /////
  private weightUnitList: string[] = Object.values(WeightUnit).sort();


  //////////////////// AGREGADO   ///////////////////////////////////7

  private generalCharacteristics: GeneralCharacteristics;
  private characteristics: GeneralCharacteristics;//caracteristicas particulares
  private generalCharacteristicsFormGroupValid: boolean = false;
  private characteristicsFormGroupValid: boolean = false;

  /////////////////////////////////////////////////////////////////





  
  constructor() { 
    this.generalCharacteristics = this.initCharacteristics();
    this.characteristics = this.initCharacteristics();

  }

  
    getCharacteristicsStringCategory(characteristicsFormGroup: FormGroup): string{// recibe el formGroup de caracteristicas de la categoria, arma el string y lo retorna
      let keys: string[] = [];
      let values: string[] = [];;
      let out = "";
  
      if(characteristicsFormGroup.valid){
        keys = Object.keys(characteristicsFormGroup.controls);
        values = Object.keys(keys).map(key => characteristicsFormGroup.get(key)?.value);
        for(let i = 0; i < keys.length; i++){
          out.concat(keys[i]);
          out.concat(",");
          out.concat(values[i+1]);
          if(i < keys.length-1){
            out.concat(",");
          }
        }
      }else{
        alert("Formgroup invalido");
      }

      return out;
    }

    getCharacteristicsString(): string{
      
      return this.characteristicsString;
      
    }

    obtainCharacteristicsString(characteristicsString: string){
      this.characteristicsString = characteristicsString;

    }
    sendCharacteristicsString(){
      return this.characteristicsString;
    }


    //////////////////////   GETS LISTAS DE TIPOS   ////////////////////////////////
    public getCountryList(){
      return this.countryList;
    }
    public getColorList(){
      return this.colorList;
    }

    public getAirTypeList(){
      return this.airTypeList;
    }

    public getHeatColdList(){
      return this.heatColdList;
    }
    public getFanTypeList(){
      return this.fanTypeList;
    }

    public getHeadphonesTypeList(){
      return this.headphonesTypeList;
    }
    public getConnectivityTypeList(){
      return this.connectivityTypeList;
    }
    public getPrinterTypeList(){
      return this.printerTypeList;
    }
    public getCoolingSystemList(){
      return this.coolingSystemList;
    }
    public getScreenTechnology(){
      return this.screenTechnology;
    }
    public getSmartList(){
      return this.smartList;
    }
    public getProcessorsList(){
      return this.processorsList;
    }
    public getMemoryUnitList(){
      return this.memoryUnitList;
    }

    public getWeightUnitList(){
      return this.weightUnitList;
    }



  public initCharacteristics(){//Inicia las caracteristicas

     let _height: Height = {
          value: 0,
          unit: LengthUnit.CM
        }
    
        let _width: Width = {
          value: 0,
          unit: LengthUnit.CM
        }
    
        let _depth: Depth = {
          value: 0,
          unit: LengthUnit.CM
        }
    
    
        let _dimension: Dimension = {
          height: _height,
          width: _width,
          depth: _depth 
        }
    
        let _weight: Weight = {
          weight: 0,
          unit: WeightUnit.GR
        }
    
    
    let characteristics: GeneralCharacteristics = {
      country: Country.NONE,
      color: Color.NONE,
      dimension: _dimension,
      weight: _weight
    }

    
    return characteristics;
  }


   

    

    public generalCharacteristicsFormGroupToGeneralCharacteristics(form: FormGroup){


      let _height: Height = {
        value: form.get("height")?.value,
        unit: LengthUnit.CM
      }
  
      let _width: Width = {
        value: form.get("width")?.value,
        unit: LengthUnit.CM
      }
  
      let _depth: Depth = {
        value: form.get("depth")?.value,
        unit: LengthUnit.CM
      }
  
  
      let _dimension: Dimension = {
        height: _height,
        width: _width,
        depth: _depth 
      }
  
      let _weight: Weight = {
        weight: form.get("weight")?.value,
        unit: form.get("weightUnit")?.value,
      }

        let characteristics: GeneralCharacteristics = {
          country: form.get("country")?.value,
          color: form.get("color")?.value,
          dimension: _dimension,
          weight: _weight
        }
        this.setGeneralCharacteristics(characteristics);
      }

      private setGeneralCharacteristics(characteristics: GeneralCharacteristics){//Recibe las caracteriticas desde el componente de caracteriticas y lo setea
        
        this.generalCharacteristics = characteristics;
        
      }



      public getFinalCharacteristics(){//Devuelve las caracteristicas establecidas en el componente de características
        this.setFinalCharacteristics();
        return this.characteristics;
      }

      public setCharacteristics(charact: GeneralCharacteristics){//Recibe las caracteriticas desde el componente de caracteriticas particulares y lo setea
        
        this.characteristics = this.initCharacteristics();
        this.characteristics = charact;
              
      }


      private setFinalCharacteristics(){//Combina generalCharacteristics y las characteristics (Particulares) y las setea en characteristics

        
       
        this.characteristics.color = this.generalCharacteristics.color;
        this.characteristics.country = this.generalCharacteristics.country;
        this.characteristics.dimension = this.generalCharacteristics.dimension;
        this.characteristics.weight = this.generalCharacteristics.weight;

        
      }

      public getCharacteristicsFormGroupValid(){

          let out: boolean = this.generalCharacteristicsFormGroupValid;
          if(!this.onlyGeneralCharacteristics){
            out = this.generalCharacteristicsFormGroupValid && this.characteristicsFormGroupValid;
          }

        return out;
      }

      public setGeneralCharacteristicsFormGroupValid(form: FormGroup){
        
        this.generalCharacteristicsFormGroupValid = form.valid;
      }

      public setCharacteristicsFormGroupValid(form: FormGroup){
        return this.characteristicsFormGroupValid = form.valid;
      }

      public setOnlyGeneralCharacteristics(value: boolean){
        this.onlyGeneralCharacteristics = value;
      }

      

}