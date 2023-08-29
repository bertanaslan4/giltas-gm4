import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReportProposalFilterPage } from './modal-report-proposal-filter.page';

describe('ModalReportProposalFilterPage', () => {
  let component: ModalReportProposalFilterPage;
  let fixture: ComponentFixture<ModalReportProposalFilterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalReportProposalFilterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReportProposalFilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
