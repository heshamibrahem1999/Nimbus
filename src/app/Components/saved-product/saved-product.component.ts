import { Component, OnInit } from '@angular/core';
import { UserInterface } from '../../Modules/user-interface';
import { SavedProductsService } from '../../Services/saved-products.service';
import { ProductServiceService } from '../../Services/product-service.service';
import { ProductInterface } from '../../Modules/product-interface';
import { SavedProduct } from '../../Modules/saved-product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-saved-product',
  templateUrl: './saved-product.component.html',
  styleUrl: './saved-product.component.scss'
})
export class SavedProductComponent implements OnInit {
  UserDetails: UserInterface | null;
  UserSavedItems: SavedProduct = {} as SavedProduct;
  ItemDetails: ProductInterface[] = [];

  constructor(private ProductService: ProductServiceService,
    private Saved: SavedProductsService,
    private Route:Router) {
    this.UserDetails = JSON.parse(localStorage.getItem('currentUser')!);

  }
  ngOnInit(): void {
    this.Saved.GetSavedByUserId(this.UserDetails!.id).subscribe(
      (SavedData) => {
        this.UserSavedItems = SavedData;
        console.log(this.UserSavedItems);
        for (let item of this.UserSavedItems.Items){
          this.ProductService.GetProductById(item).subscribe(
            (ProductData) => {
              this.ItemDetails.push(ProductData);
            }
          )
        }
      }
    )
  }

  CancelSave(index:number){
    this.UserSavedItems.Items.splice(index,1);
    this.ItemDetails.splice(index,1);
    this.Saved.UpdateSaved(this.UserSavedItems);
  }

  GoToDetails(index:number){
    this.Route.navigate([`/Product/${this.ItemDetails[index].id}`])
  }
}
