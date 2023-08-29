import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAttributesPage } from './product-attributes.page';

describe('ProductAttributesPage', () => {
  let component: ProductAttributesPage;
  let fixture: ComponentFixture<ProductAttributesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductAttributesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAttributesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
