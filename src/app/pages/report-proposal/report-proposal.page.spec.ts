import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportProposalPage } from './report-proposal.page';

describe('ReportProposalPage', () => {
  let component: ReportProposalPage;
  let fixture: ComponentFixture<ReportProposalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportProposalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportProposalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
