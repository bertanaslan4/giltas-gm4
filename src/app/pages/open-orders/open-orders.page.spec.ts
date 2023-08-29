import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenOrdersPage } from './open-orders.page';

describe('OpenOrdersPage', () => {
  let component: OpenOrdersPage;
  let fixture: ComponentFixture<OpenOrdersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenOrdersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
