import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFilterReportPage } from './modal-filter-report.page';

describe('ModalFilterReportPage', () => {
  let component: ModalFilterReportPage;
  let fixture: ComponentFixture<ModalFilterReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFilterReportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFilterReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
