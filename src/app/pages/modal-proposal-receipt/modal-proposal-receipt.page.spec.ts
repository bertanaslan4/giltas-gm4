import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProposalReceiptPage } from './modal-proposal-receipt.page';

describe('ModalProposalReceiptPage', () => {
  let component: ModalProposalReceiptPage;
  let fixture: ComponentFixture<ModalProposalReceiptPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProposalReceiptPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProposalReceiptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
