import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerExtraReportPage } from './customer-extra-report.page';

describe('CustomerExtraReportPage', () => {
  let component: CustomerExtraReportPage;
  let fixture: ComponentFixture<CustomerExtraReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerExtraReportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerExtraReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
