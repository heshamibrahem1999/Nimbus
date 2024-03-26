import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-product-sort',
  templateUrl: './product-sort.component.html',
  styleUrl: './product-sort.component.scss'
})
export class ProductSortComponent {
  @Output() SortOutput = new EventEmitter<string>();
  constructor(){
   
  }

   addNewItem(value: string) {
     this.SortOutput.emit(value);
   }
}
