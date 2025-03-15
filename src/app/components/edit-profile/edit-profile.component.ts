declare var bootstrap: any;
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/login/auth.service';
import { RegisterService, User } from '../../services/register-service/register.service';
import { PurchaseService } from '../../services/purchase-service/purchase-service.service';
import { Purchase } from '../../models/purchases/purchase';
import { ChangeDetectorRef } from '@angular/core';
import { CustomValidators } from '../../common/custom-validators';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import Swal from 'sweetalert2';
import { BsasCity } from '../../models/bsas-city';
import { Province } from '../../models/province';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  
  user: User = {
    name: '',
    lastname: '',
    birthdate: new Date(),
    province: '',
    city: '',
    street: '',
    streetNumber: '',
    floor: '',
    flat: '',
    email: '',
    password: ''
  };

  purchases: Purchase[] = [];  
  profileForm: FormGroup;
  changePasswordForm: FormGroup;
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  selectedPurchaseId: number | null = null;
  bsasCityList: string[] = Object.values(BsasCity);
  provincesList: string[] = Object.values(Province);

  constructor(
    private authService: AuthService,
    private registerService: RegisterService,
    private purchaseService: PurchaseService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private router: Router,
    private productService: ProductService
    
  ) {
    
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, CustomValidators.lettersOnly()]], 
      lastname: ['', [Validators.required, CustomValidators.lettersOnly()]],
      birthdate: ['', [Validators.required, CustomValidators.ageRangeLimitator(18, 100)]], 
      email: ['', [Validators.required, Validators.email, CustomValidators.emailDomainValidator]],
      street: ['', Validators.required],
      streetNumber: ['', [Validators.required, CustomValidators.numbersOnly()]],
      city: ['', Validators.required],
      province: ['', Validators.required]
    });
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: CustomValidators.samePasswordValidator });
  }
  
  ngOnInit(): void {
    const userId: string | null = this.authService.getUserId();
    if (!userId) {
      console.warn('No se encontró un ID de usuario en la sesión.');
      return;
    }
    
    this.registerService.getUserById(userId).subscribe({
      next: (response) => {
        this.user = response;
        this.profileForm.patchValue(this.user); 
        //console.log('Datos del usuario cargados:', this.user);
      },
      error: (error) => {
        console.error(`Error al obtener usuario con ID ${userId}:`, error);
      }
    });

    this.purchaseService.obtenerComprasPorCliente(userId).subscribe({
      next: (response) => {
        this.purchases = response;
        //console.log('Compras del usuario:', this.purchases);
      },
      error: (error) => {
        console.error(`Error al obtener compras del usuario con ID ${userId}:`, error);
      },
    });
  }

  openEditModal(userData: any) {
    this.user = { ...userData };  
    this.profileForm.patchValue(this.user); 

    setTimeout(() => {
      this.cd.detectChanges(); 
    }, 0);
  }
 
  saveProfile() {
    if (this.profileForm.valid) {
      const updatedUser = { ...this.user, ...this.profileForm.value };
  
      console.log("Guardando cambios...", updatedUser);
  
      this.registerService.updateUser(updatedUser).subscribe({
        next: (response) => {
          this.user = { ...updatedUser }; 
          this.profileForm.patchValue(updatedUser); 
          this.showToast("Perfil actualizado correctamente.", "success");
          this.closeModal('editProfileModal');
        },
        error: (error) => {
          this.showToast("Error al actualizar perfil.", "error");
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }
  

  saveAddress() {
    if (this.profileForm.valid) {
      const updatedUser = { ...this.user, ...this.profileForm.value };
  
      console.log("Guardando cambios...", updatedUser);
  
      this.registerService.updateUser(updatedUser).subscribe({
        next: (response) => {
          this.user = { ...updatedUser };
          this.profileForm.patchValue(updatedUser);
          this.showToast("Dirección actualizada correctamente.", "success");
          this.closeModal('editAddressModal');
        },
        error: (error) => {
          this.showToast("Error al actualizar la dirección.", "error");
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }


  changePassword() {
    if (this.changePasswordForm.invalid) {
      this.showToast("Por favor, complete todos los campos correctamente.", "error");
      return;
    }
    const { currentPassword, newPassword } = this.changePasswordForm.value;
    if (currentPassword !== this.user.password) {
      this.showToast("La contraseña actual es incorrecta.", "error");
      return;
    }
    if (newPassword === currentPassword) {
      this.showToast("La nueva contraseña no puede ser igual a la anterior.", "error");
      return;
    }
    const updatedUser = { ...this.user, password: newPassword };
    this.registerService.updateUser(updatedUser).subscribe({
      next: () => {
        this.user.password = newPassword;
        this.showToast("Contraseña actualizada correctamente.", "success");
        this.closeModal('changePasswordModal');
      },
      error: () => {
        this.showToast("Error al actualizar la contraseña.", "error");
      }
    });
  }

  showToast(message: string, type: 'success' | 'error') {
    const toastContainer = document.getElementById('toastContainer');
    if (toastContainer) {
      const toastElement = document.createElement('div');
      toastElement.className = `toast align-items-center text-bg-${type} border-0`;
      toastElement.setAttribute('role', 'alert');
      toastElement.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      `;
      
      toastContainer.appendChild(toastElement);
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    }
  }
  
  closeModal(modalName: string) {
    const modal = document.getElementById(modalName) as any;
    if (modal) {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  
    setTimeout(() => {
      if (document.querySelector('.modal.show') === null) { 
        document.body.classList.remove('modal-open');
        document.body.style.overflow = ''; 
      }
    }, 300);
  
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }
  
  
  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    if (field === 'current') {
      this.showCurrentPassword = !this.showCurrentPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
  goHome(): void {
    this.router.navigate(['/home']);
  }

  async loadProductDetails(purchase: Purchase) {
    if (!purchase.productos) {
      purchase.productos = [];
  
      const productRequests = purchase.productos.map(product =>
        this.productService._getProductById(product.id).toPromise().catch(() => ({
          cantidad: product.quantity,
          precio: product.price,
          brand: 'Producto no disponible',
        }))
      );
  
      try {
        const productsData = await Promise.all(productRequests);
        purchase.productosCargados = productsData.map((product, index) => ({
          cantidad: purchase.productos[index].quantity,
          precio: purchase.productos[index].price,
          brand: product?.brand || 'Producto no disponible',
        }));
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      }
    }
  }
  
  async togglePurchaseDetails(purchase: Purchase) {
    // Cargar los detalles de los productos si no están cargados
    if (!purchase.productos) {
      await this.loadProductDetails(purchase);
    }
  
    // Crear el contenido HTML para mostrar en SweetAlert2
    const detallesProductos = purchase.productos
      .map(
        (product) => `
          <div style="margin-bottom: 15px;">
            
            <strong>Marca:</strong> ${product.brand} <br>
            <strong>Modelo:</strong> ${product.model} <br>
            <strong>Precio:</strong> $${product.price.toFixed(2)} <br>
            <strong>Cantidad:</strong> ${product.quantity} <br>
          </div>
        `
      )
      .join('');
  
    const contenidoHtml = `
      <strong>Productos comprados:</strong>
      <div style="max-height: 300px; overflow-y: auto; margin-top: 10px;">
        ${detallesProductos}
      </div>
      <br>
      <strong>Total:</strong> $${purchase.total.toFixed(2)} <br>
      <strong>Fecha de la compra:</strong> ${new Date(purchase.fecha).toLocaleString()}
    `;
  
    await Swal.fire({
      title: 'Detalles de la compra',
      html: contenidoHtml,
      icon: 'info',
      showCancelButton: false,
      confirmButtonText: 'Cerrar',
      backdrop: true,
      customClass: {
        popup: 'custom-swal-dark',
        title: 'custom-title-dark',
        confirmButton: 'custom-confirm-button-dark',
      },
    });
  }
}