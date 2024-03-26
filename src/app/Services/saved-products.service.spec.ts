import { TestBed } from '@angular/core/testing';

import { SavedProductsService } from './saved-products.service';

describe('SavedProductsService', () => {
  let service: SavedProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavedProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
