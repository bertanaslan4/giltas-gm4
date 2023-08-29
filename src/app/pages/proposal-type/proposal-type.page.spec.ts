import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalTypePage } from './proposal-type.page';

describe('ProposalTypePage', () => {
  let component: ProposalTypePage;
  let fixture: ComponentFixture<ProposalTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalTypePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
