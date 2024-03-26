import { Component, ElementRef, EventEmitter, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ProductServiceService } from '../../Services/product-service.service';
import { ProductInterface } from '../../Modules/product-interface';
import { Router } from '@angular/router';


@Component({
  selector: 'app-products-component',
  templateUrl: './products-component.component.html',
  styleUrl: './products-component.component.scss'
})
export class ProductsComponentComponent implements OnInit{
  ViewedProduct:ProductInterface[] = [];
  Hide:number=1;
  SortHide:number=1;
  
  constructor(private ProductService:ProductServiceService,
    private router:Router){
    
  }

  ChangeCategory(Category: string){
    if (Category == "All"){
      this.ProductService.GetAllProduct().subscribe(data=>this.ViewedProduct=data);
    }else{
      this.ProductService.GetProductsByCategory(Category).subscribe(data=>this.ViewedProduct=data);
    }
  }
  SortItems(SortBy: string){
    switch(SortBy) {
      case "1":
        this.ViewedProduct = this.ViewedProduct.sort(
          (p1, p2) => (p1.price < p2.price) ? -1 : (p1.price > p2.price) ? 1 : 0);
        break;
      case "2":
        this.ViewedProduct = this.ViewedProduct.sort(
          (p1, p2) => (p1.price < p2.price) ? 1 : (p1.price > p2.price) ? -1 : 0);
        break;
      case "3":
        this.ViewedProduct = this.ViewedProduct.sort(
          (p1, p2) => (p1.stock < p2.stock) ? -1 : (p1.stock > p2.stock) ? 1 : 0);
        break;
      case "4":
        this.ViewedProduct = this.ViewedProduct.sort(
          (p1, p2) => (p1.stock < p2.stock) ? 1 : (p1.stock > p2.stock) ? -1 : 0);
        break;
      case "5":
        this.ViewedProduct = this.ViewedProduct.sort(
          (p1, p2) => (p1.title < p2.title) ? -1 : (p1.title > p2.title) ? 1 : 0);
        break;
      case "6":
        this.ViewedProduct = this.ViewedProduct.sort(
          (p1, p2) => (p1.title < p2.title) ? 1 : (p1.title > p2.title) ? -1 : 0);
        break;
      case "7":
        this.ViewedProduct = this.ViewedProduct.sort(
          (p1, p2) => (p1.rating < p2.rating) ? -1 : (p1.rating > p2.rating) ? 1 : 0);
        break;
      case "8":
        this.ViewedProduct = this.ViewedProduct.sort(
          (p1, p2) => (p1.rating < p2.rating) ? 1 : (p1.rating > p2.rating) ? -1 : 0);
        break;
      
    }
  }
  ngOnInit(): void {
    this.ProductService.GetAllProduct().subscribe(data=>this.ViewedProduct=data)
  }
  FilterDisplay(): void{
    if (this.Hide==1){
      this.Hide=0
    }else{
      this.Hide=1
    }
  }
  SortDisplay(): void{
    if (this.SortHide==1){
      this.SortHide=0
    }else{
      this.SortHide=1
    }
  }
  ProductDetails(ID:number){
    console.log(ID)
    this.router.navigate(['/Product',ID]);
  }

}
