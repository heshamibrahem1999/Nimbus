import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './Components/sign-up/sign-up.component';
import { MainLayOutComponent } from './Components/main-lay-out/main-lay-out.component';
import { LoginComponent } from './Components/login/login.component';
import { HomeComponent } from './Components/home/home.component';
import { ProductsComponentComponent } from './Components/products-component/products-component.component';
import { ProductDetailsComponent } from './Components/product-details/product-details.component';
import { CartShowComponent } from './Components/cart-show/cart-show.component';
import { SavedProductComponent } from './Components/saved-product/saved-product.component';

const routes: Routes = [
  {path:'',component:MainLayOutComponent, children:[
    {path:'',component:HomeComponent},
    {path:'Home',component:HomeComponent},
    {path:'Product',component:ProductsComponentComponent},
    {path:'Product/:PID',component:ProductDetailsComponent},
    {path:'Cart',component:CartShowComponent},
    {path:'Saved',component:SavedProductComponent}
  ]},
  {path:'SignUp',component:SignUpComponent},
  {path:'LogIn',component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
