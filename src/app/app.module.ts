import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Components/header/header.component';
import { SignUpComponent } from './Components/sign-up/sign-up.component';
import { LoginComponent } from './Components/login/login.component';
import { MainLayOutComponent } from './Components/main-lay-out/main-lay-out.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { HomeComponent } from './Components/home/home.component';
import { ProductsComponentComponent } from './Components/products-component/products-component.component';
import { ProductFilterComponent } from './Components/product-filter/product-filter.component';
import { ProductSortComponent } from './Components/product-sort/product-sort.component';
import { ProductDetailsComponent } from './Components/product-details/product-details.component';
import { CartShowComponent } from './Components/cart-show/cart-show.component';
import { SavedProductComponent } from './Components/saved-product/saved-product.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignUpComponent,
    MainLayOutComponent,
    HomeComponent,
    ProductsComponentComponent,
    ProductFilterComponent,
    ProductSortComponent,
    ProductDetailsComponent,
    CartShowComponent,
    SavedProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    FormsModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
