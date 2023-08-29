import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerExtraReportDetailPage } from './customer-extra-report-detail.page';

describe('CustomerExtraReportDetailPage', () => {
  let component: CustomerExtraReportDetailPage;
  let fixture: ComponentFixture<CustomerExtraReportDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerExtraReportDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerExtraReportDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
