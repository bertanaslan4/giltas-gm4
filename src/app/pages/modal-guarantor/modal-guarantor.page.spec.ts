import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGuarantorPage } from './modal-guarantor.page';

describe('ModalGuarantorPage', () => {
  let component: ModalGuarantorPage;
  let fixture: ComponentFixture<ModalGuarantorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGuarantorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGuarantorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
