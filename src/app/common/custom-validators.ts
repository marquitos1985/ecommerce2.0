import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from "@angular/forms";
import { DiscountCouponService } from "../services/discount-coupon/discount-coupon.service";
import { DiscountCoupon } from "../interfaces/product/discount-coupon";

export class CustomValidators {

    static lettersOnly(): ValidatorFn {
        let regExp: RegExp = /^[a-zA-Z\s]*$/;

        return (control: AbstractControl): {[key: string]: any} | null => {                     
            const lettersOnly = regExp.test(control.value);

            return !lettersOnly ? { 'lettersOnly': {value: control.value} } : null;
        };
    }

    static numbersOnly(): ValidatorFn {
        let regExp: RegExp = /^[0-9\s]*$/;

        return (control: AbstractControl): {[key: string]: any} | null => {                     
            const numbersOnly = regExp.test(control.value);

            return !numbersOnly ? { 'numbersOnly': {value: control.value} } : null;
        };
    }

    static emailDomainValidator(control: AbstractControl): ValidationErrors | null {// Valida que el dominio sea servidor o .com.ar o .com
        const email = control.value;
        const emailRegex = /^[^@]+@[^@]+.[a-zA-Z]{2,}$/;
        if (email && !emailRegex.test(email)) {
          return { emailDomainValidator: true };
        }
      
        return null;
    }
    
    static ageRangeLimitator(minAge: number, maxAge: number) {
        return (control: AbstractControl): ValidationErrors | null => {
          const birthdate = new Date(control.value);
          const today = new Date();
          
          // Calcula la edad inclusive verificando el mes y el día
          const age = today.getFullYear() - birthdate.getFullYear();
          const monthDifference = today.getMonth() - birthdate.getMonth();
          const dayDifference = today.getDate() - birthdate.getDate();
    
          // Ajustar edad si el mes o día no ha pasado
          const adjustedAge = monthDifference < 0 || (monthDifference === 0 && dayDifference < 0) ? age - 1 : age;
    
          // Validar que se cumpla rango de edades pasado por parámetro
          if (adjustedAge < minAge || adjustedAge > maxAge) {
            return { ageRangeLimitator: true }; // Error
          }
    
          return null; // Válido
        };
    }

    static samePasswordValidator(group: AbstractControl): ValidationErrors | null {
        const password = group.get('newPassword')?.value;
        const passwordConfirmation = group.get('confirmPassword')?.value;
        
        return password === passwordConfirmation ? null : { samePasswordValidator: true };
      }




       static couponExists(discountCouponService: DiscountCouponService): AsyncValidatorFn{
        return (control: AbstractControl): Promise<ValidationErrors | null> =>{
            
            let discountCoupon = control.value;
            let findedDiscountCoupon: DiscountCoupon | undefined;
            if(discountCoupon == "" || discountCoupon == undefined){
              
              return Promise.resolve({["couponExists"]:{value: control.value}});
            }
            
            
            return discountCouponService.getAll().toPromise()
            .then(response =>{
              
              let discountCoupons: DiscountCoupon[] | undefined = response;

              if(discountCoupons != undefined){
                
                findedDiscountCoupon = discountCouponService.getDiscountCouponByCode(discountCoupons, control.value);
              }
                //existe el cupon
                if(findedDiscountCoupon != undefined){
                  //Tiene stock infinito
                  if(findedDiscountCoupon.infinitStock){
                    return {["couponExists"]:{value: control.value}};

                  //Si no tiene stock infinito
                  }else{
                    //si el stock es mayor a 0
                    if(findedDiscountCoupon.stock > 0){
                      return {["couponExists"]:{value: control.value}};

                    //Si el stock es cero
                    }else{
                      return null;
                    }
                  }
                    
                    
                }else{
                    return null;
                    
                }
            })
            .catch(error =>{
                
                return Promise.resolve({["emailExists"]:{value: control.value}});
            });
        }
    }
      
}
