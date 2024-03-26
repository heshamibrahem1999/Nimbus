import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedProductComponent } from './saved-product.component';

describe('SavedProductComponent', () => {
  let component: SavedProductComponent;
  let fixture: ComponentFixture<SavedProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SavedProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SavedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
