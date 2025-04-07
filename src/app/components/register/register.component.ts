import { Component, OnInit } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  RegisterService,
  User,
} from '../../services/register-service/register.service';
import { AuthService } from '../../services/login/auth.service';
import { CustomValidators } from '../../common/custom-validators';
import { BsasCity } from '../../models/bsas-city';
import { Province } from '../../models/province';
import { Usuario } from '../../models/users/user';
import { Role } from '../../models/users/role';
import { Router } from '@angular/router';
import { response } from 'express';
import { error } from 'console';
import { LoginCredentials } from '../../models/users/login-credentials';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../services/user/user.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    standalone: false
})
export class RegisterComponent implements OnInit{
  registerForm: FormGroup;
  provincesList: string[] = Object.values(Province);
  bsasCityList: string[] = Object.values(BsasCity);
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;  
  private token: string = "";
  private emailExists: boolean = false;
  emailExistsMessage: string = "";

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService,
    private userService: UserService
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

  ngOnInit(): void {
      this.registerForm.valueChanges.subscribe(form =>{
        this.emailExistsMessage = "";
      });

      
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

      /* this.registerService.checkEmailExists(email).subscribe(
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
      ); */
      this.registerService.registerUser(nuevoUsuario).subscribe({
        next: response =>{
          console.log(response);
          console.log("Usuario registrado con exito...");
          let loginCredentials = new LoginCredentials(nuevoUsuario.email, nuevoUsuario.password);

          this.authService.login(loginCredentials).subscribe({
                    next: response => {
                      this.token = response['token'];
                      this.cookieService.set('token', this.token);

                      this.userService.getUserByEmail(loginCredentials.getEmail()).subscribe({
                        next: response =>{
                          console.log("Login" + response);
                          this.cookieService.set('email', response['email']);
                          this.cookieService.set('id', response['id']);
                          this.cookieService.set('name', response['name']);
                          this.cookieService.set('lastname', response['lastname']);
                          this.cookieService.set('role', response['role']);
                        }, error: error =>{
                          console.log("No se pudieron obtener los datos del usuario...");
                        }
                      });

                      this.router.navigate(['/']);
                      
                    },
                    error: (error) => {
                      console.error(error);
                    },
                  });
                  
        },
        error: error =>{
          this.emailExistsMessage = "Email ya existente..."
          console.log("Error al registrar usuario ");
          console.log(error);
          console.log(error.message);
          
        }
      });
    }
  }
}

