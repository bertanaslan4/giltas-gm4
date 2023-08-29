import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCountryPage } from './modal-country.page';

describe('ModalCountryPage', () => {
  let component: ModalCountryPage;
  let fixture: ComponentFixture<ModalCountryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCountryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCountryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
