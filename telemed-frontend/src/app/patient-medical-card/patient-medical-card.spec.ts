import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMedicalCard } from './patient-medical-card';

describe('PatientMedicalCard', () => {
  let component: PatientMedicalCard;
  let fixture: ComponentFixture<PatientMedicalCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientMedicalCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientMedicalCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
