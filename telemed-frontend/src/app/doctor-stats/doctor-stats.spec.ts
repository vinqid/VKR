import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorStats } from './doctor-stats';

describe('DoctorStats', () => {
  let component: DoctorStats;
  let fixture: ComponentFixture<DoctorStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorStats],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
