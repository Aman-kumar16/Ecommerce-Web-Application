import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [

  { path: 'login', component:LoginComponent},
  { path: 'register', component:RegisterComponent}, 
  { path: 'checkout', component:CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'cart-details', component:CartDetailsComponent},
  { path: 'products/:id', component:ProductDetailsComponent},
  { path: 'search/:keyword', component:ProductListComponent},
  { path: 'category/:id', component: ProductListComponent},
  { path: 'category', component: ProductListComponent},
  { path: 'products', component: ProductListComponent},
  { path: '', redirectTo: '/products', pathMatch: 'full'}, // must use full otherwise directs every path to the mentioned component.
  { path: '**', redirectTo: '/products', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
