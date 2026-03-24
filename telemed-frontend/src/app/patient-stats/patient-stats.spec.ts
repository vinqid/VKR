import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientStatsComponent } from './patient-stats';

describe('PatientStats', () => {
  let component: PatientStats;
  let fixture: ComponentFixture<PatientStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientStats],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
