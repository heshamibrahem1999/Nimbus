import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../../Services/product-service.service';
import { ProductInterface } from '../../Modules/product-interface';
import { ActivatedRoute } from '@angular/router';
import { CartBoughtProductsService } from '../../Services/cart-bought-products.service';
import { SavedProductsService } from '../../Services/saved-products.service';
import { SavedProduct } from '../../Modules/saved-product';
import { UserInterface } from '../../Modules/user-interface';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  UserDetails: UserInterface | null = null;
  ProductSelected: ProductInterface = {} as ProductInterface;
  CurrPrdID: number = 0;
  CurrImg: number = 0;
  SimilarItems: ProductInterface[] = {} as ProductInterface[];
  Alert: boolean = false;
  IsSaved: boolean = false;
  SavedDetails: SavedProduct = {} as SavedProduct;
  SavedList: number[] = [];
  constructor(private ProductService: ProductServiceService,
    private ActivatedRoute: ActivatedRoute,
    private AddCartService: CartBoughtProductsService,
    private SavedProduct: SavedProductsService) {
    this.UserDetails = JSON.parse(localStorage.getItem('currentUser')!);
  }
  ngOnInit(): void {

    this.ActivatedRoute.paramMap.subscribe((paramMap) => {
      this.CurrPrdID = Number(paramMap.get('PID'));
      this.ProductService.GetProductById(this.CurrPrdID).subscribe(data => {
        this.ProductSelected = data;
        this.ProductService.GetProductsByCategory(this.ProductSelected.category).subscribe((data) => {
          this.SimilarItems = data;
          this.SimilarItems = this.Shuffle(this.SimilarItems);
          this.SavedProduct.GetSavedByUserId(this.UserDetails!.id).subscribe(
            (SavedDetails) => {
              this.SavedDetails = SavedDetails;
              this.SavedList = this.SavedDetails.Items;
              if (this.SavedList.includes(this.CurrPrdID)) {
                this.IsSaved = true;
              }else{
                this.IsSaved = false;
              }
            }
          )
        })
        
      })

    })

  }

  ImgSelected(index: number): void {
    this.CurrImg = index;

  }

  Round(number: number): number {
    return Math.round(number)
  }

  Shuffle(array: ProductInterface[]) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  AddCart(id: number, Amount: string) {
    if (this.UserDetails){
      this.AddCartService.GetCartItemsByID(this.UserDetails!.id).subscribe(
        (CurrentUserCart) => {
          this.AddCartService.AddCart(CurrentUserCart, +id, parseInt(Amount));
          this.Alert = true;
          setTimeout(() => { this.Alert = false; }, 5000)
        }
      )
    }else{
      alert("You must log in!!");
    }
    

  }


  SavedToggle() {
    if (this.UserDetails){
      if (this.IsSaved) {
        this.SavedDetails.Items = this.SavedList.filter((value) => { return value != this.CurrPrdID });
        this.SavedProduct.UpdateSaved(this.SavedDetails);
        this.IsSaved = false;
      } else {
        this.SavedDetails.Items.push(this.CurrPrdID);
        this.SavedProduct.UpdateSaved(this.SavedDetails);
        this.IsSaved = true;
      }
    }else{
      alert("You must log in!!");
    }
    
  }

  BuyNow(){
    if (this.UserDetails){}
    else{
      alert("You must log in!!");
    }
  }
}
