import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOtherstoresPage } from './product-otherstores.page';

describe('ProductOtherstoresPage', () => {
  let component: ProductOtherstoresPage;
  let fixture: ComponentFixture<ProductOtherstoresPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductOtherstoresPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductOtherstoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
