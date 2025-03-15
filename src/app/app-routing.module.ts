import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './models/users/guards/auth.guard';
import { NoAuthGuard } from './models/users/guards/no-auth.guard';
import { CartComponent } from './components/cart/cart.component';
import { ProductDetailsComponent } from './components/products/details/product-details/product-details.component';
import { BuyFormComponent } from './components/buy-form/buy-form.component';
import { AdminGuard } from './models/users/guards/admin.guard';
import { ProductEditComponent } from './components/products/product-edit/product-edit.component';
import { CreateProductComponent } from './components/products/create-product/create-product.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'createProduct',
    component: CreateProductComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NoAuthGuard],
  },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  {
    path: 'productDetails/:id',
    component: ProductDetailsComponent,
  },
  { path: 'profile', component: EditProfileComponent, canActivate: [AuthGuard]},
  { path: 'buyForm', component: BuyFormComponent, canActivate: [AuthGuard] },
  {path: "productEdit/:id", component: ProductEditComponent, canActivate:[AdminGuard]},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
