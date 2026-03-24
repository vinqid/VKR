import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicPatients } from './medic-patients';

describe('MedicPatients', () => {
  let component: MedicPatients;
  let fixture: ComponentFixture<MedicPatients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicPatients],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicPatients);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
