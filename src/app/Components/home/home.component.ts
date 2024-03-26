import { Component, OnChanges, OnInit, SimpleChanges, AfterViewInit } from '@angular/core';
import { ProductServiceService } from '../../Services/product-service.service';
import { ProductInterface } from '../../Modules/product-interface';
import { Observable } from 'rxjs';
import { UserInterface } from '../../Modules/user-interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnChanges, OnInit {
  ProductAll: Observable<ProductInterface[]>;
  FirstThreeProduct: (ProductInterface | null)[] = [];
  SecondThreeProduct: (ProductInterface | null)[] = [];
  constructor(private ProductService: ProductServiceService) {
    this.ProductAll = ProductService.ProductList;
  }

  ngOnInit(): void {
    this.ProductService.GetProductById(1).subscribe(data=>this.FirstThreeProduct.push(data))
    this.ProductService.GetProductById(2).subscribe(data=>this.FirstThreeProduct.push(data))
    this.ProductService.GetProductById(3).subscribe(data=>this.FirstThreeProduct.push(data))
    this.ProductService.GetProductById(4).subscribe(data=>this.SecondThreeProduct.push(data))
    this.ProductService.GetProductById(5).subscribe(data=>this.SecondThreeProduct.push(data))
    this.ProductService.GetProductById(6).subscribe(data=>this.SecondThreeProduct.push(data))
  }
  ngOnChanges(changes: SimpleChanges): void {
    
  }

}
