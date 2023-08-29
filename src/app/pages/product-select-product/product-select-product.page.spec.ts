import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSelectProductPage } from './product-select-product.page';

describe('ProductSelectProductPage', () => {
  let component: ProductSelectProductPage;
  let fixture: ComponentFixture<ProductSelectProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSelectProductPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSelectProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
