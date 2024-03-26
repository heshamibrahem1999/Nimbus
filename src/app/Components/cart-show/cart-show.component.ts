import { Component, OnInit } from '@angular/core';
import { UserAddCart } from '../../Modules/user-add-cart';
import { ProductServiceService } from '../../Services/product-service.service';
import { ProductInterface } from '../../Modules/product-interface';
import { CartBoughtProductsService } from '../../Services/cart-bought-products.service';
import { UserInterface } from '../../Modules/user-interface';

@Component({
  selector: 'app-cart-show',
  templateUrl: './cart-show.component.html',
  styleUrl: './cart-show.component.scss'
})
export class CartShowComponent implements OnInit {
  UserDetails: UserInterface | null;
  UserCartItems: UserAddCart = {} as UserAddCart;
  CartItems: any[] = [];
  ItemDetails: ProductInterface[] = [];
  TotalItemToBuy: { IsChecked: boolean, Price: number }[] = [];
  TotalPrice: number = 0;

  constructor(private ProductService: ProductServiceService,
    private Cart: CartBoughtProductsService) {
    this.UserDetails = JSON.parse(localStorage.getItem('currentUser')!);

  }

  ngOnInit() {
    this.Cart.GetCartItemsByID(this.UserDetails!.id).subscribe(
      (UserCartdata) => {
        this.UserCartItems = UserCartdata;
        for (let item of this.UserCartItems.ItemsInCart) {
          this.ProductService.GetProductById(item.Id).subscribe(
            (data) => {
              this.CartItems.push({ CartCount: item, CartDetails: data });
              let PriceAfterSale = (data.price * (1 - (data.discountPercentage / 100))) * item.Count;
              this.ItemDetails.push(data);
              this.TotalItemToBuy.push({ IsChecked: false, Price: PriceAfterSale });
            }
          )
        }
      })


  }

  UpdateTotal() {
    this.TotalPrice = 0
    for (let item of this.TotalItemToBuy) {
      if (item.IsChecked) {
        this.TotalPrice += item.Price;
      }
    }
  }

  Increase(Index: number) {
    let OldCount = this.CartItems[Index].CartCount.Count;
    let OldPrice = this.TotalItemToBuy[Index].Price;
    if (OldCount < this.CartItems[Index].CartDetails.stock) {
      this.CartItems[Index].CartCount.Count += 1;
      this.TotalItemToBuy[Index].Price = OldPrice * this.CartItems[Index].CartCount.Count / OldCount;
    }
  }

  Decrease(Index: number) {
    let OldCount = this.CartItems[Index].CartCount.Count;
    let OldPrice = this.TotalItemToBuy[Index].Price;
    if (OldCount > 0) {
      this.CartItems[Index].CartCount.Count -= 1;
      this.TotalItemToBuy[Index].Price = OldPrice * this.CartItems[Index].CartCount.Count / OldCount;
    }
  }

  Buy() {
    let x = 0;
    for (let i in this.TotalItemToBuy) {
      if (this.TotalItemToBuy[i].IsChecked) {
        this.ItemDetails[parseInt(i)].stock -= this.CartItems[parseInt(i) - x].CartCount.Count;
        this.CartItems.splice(parseInt(i) - x,1);
        this.ProductService.UpdateProduct(this.ItemDetails[parseInt(i)]);
        this.UserCartItems.ItemsInCart.splice(parseInt(i) - x,1);
        this.Cart.UpdateCartProductInApi(this.UserCartItems);
        x += 1;
      }
    }
  }
}
