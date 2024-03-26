import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductServiceService } from '../../Services/product-service.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.scss'
})
export class ProductFilterComponent implements OnInit {
  Category:string[]=[];
  @Output() newItemEvent = new EventEmitter<string>();
 constructor(private ProductService:ProductServiceService){
  
 }
  ngOnInit(): void {
    this.Category = this.ProductService.CategoryList;
  }
  addNewItem(value: string) {
    this.newItemEvent.emit(value);
  }
}
