import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalPage } from './proposal.page';

describe('ProposalPage', () => {
  let component: ProposalPage;
  let fixture: ComponentFixture<ProposalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
