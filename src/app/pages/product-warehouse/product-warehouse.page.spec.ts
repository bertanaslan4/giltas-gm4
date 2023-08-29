import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWarehousePage } from './product-warehouse.page';

describe('ProductWarehousePage', () => {
  let component: ProductWarehousePage;
  let fixture: ComponentFixture<ProductWarehousePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductWarehousePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductWarehousePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
