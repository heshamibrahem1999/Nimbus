import { TestBed } from '@angular/core/testing';

import { CartBoughtProductsService } from './cart-bought-products.service';

describe('CartBoughtProductsService', () => {
  let service: CartBoughtProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartBoughtProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
