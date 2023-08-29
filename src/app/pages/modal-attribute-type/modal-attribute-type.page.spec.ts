import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAttributeTypePage } from './modal-attribute-type.page';

describe('ModalAttributeTypePage', () => {
  let component: ModalAttributeTypePage;
  let fixture: ComponentFixture<ModalAttributeTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAttributeTypePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAttributeTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
