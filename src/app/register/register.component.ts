import { Component } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  RegisterService,
  User,
} from '../services/register-service/register.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/login/auth.service';
import { CustomValidators } from '../common/custom-validators';
import { BsasCity } from '../models/bsas-city';
import { Province } from '../models/province';
import { Usuario } from '../models/users/user';
import { Role } from '../models/users/role';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  provincesList: string[] = Object.values(Province);
  bsasCityList: string[] = Object.values(BsasCity);
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;  
  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, CustomValidators.lettersOnly()]],
      lastname: ['', [Validators.required, CustomValidators.lettersOnly()]],
      dni: ["", [Validators.required, CustomValidators.numbersOnly()]],
      birthdate: [
        '',
        [Validators.required, CustomValidators.ageRangeLimitator(18, 100)],
      ],
      province: [Province.BuenosAires, Validators.required],
      city: [BsasCity.MarDelPlata, Validators.required],
      street: ['', Validators.required],
      streetNumber: ['', [Validators.required, CustomValidators.numbersOnly()]],
      floor: [''],
      flat: [''],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          CustomValidators.emailDomainValidator,
        ],
      ],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
      role: [Role.USER]
    } ,
    { validators: CustomValidators.samePasswordValidator }
  );
  }
  togglePasswordVisibility(field: 'new' | 'confirm') {
    if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  samePasswordValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const passwordConfirmation = form.get('passwordConfirmation')?.value;
    return password === passwordConfirmation ? null : { samePasswordValidator: true };
  }
  onSubmit() {
    if (this.registerForm.valid) {
      const {
        name,
        lastname,
        dni,
        birthdate,
        province,
        city,
        street,
        streetNumber,
        floor,
        flat,
        email,
        password,
        role
      } = this.registerForm.value;
      
      const nuevoUsuario: Usuario = {
        name,
        lastname,
        dni,
        birthdate,
        province,
        city,
        street,
        streetNumber,
        floor,
        flat,
        email,
        password,
        role
      };

      this.registerService.checkEmailExists(email).subscribe(
        (exists) => {
          if (exists) {
            alert('Este correo electrónico ya está registrado.');
          } else {
            this.registerService.registerUser(nuevoUsuario).subscribe(
              (response) => {
                this.authService
                  .login(nuevoUsuario.email, nuevoUsuario.password)
                  .subscribe({
                    next: (success) => {
                      if (success) {
                        this.router.navigate(['/']);
                      }
                    },
                    error: (error) => {
                      console.error(error);
                    },
                  });
              },
              (error) => {
                console.error('Error al registrar el usuario:', error);
              }
            );
          }
        },
        (error) => {
          console.error('Error al verificar el correo:', error);
        }
      );
    }
  }
}

