import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicAppointments } from './medic-appointments';

describe('MedicAppointments', () => {
  let component: MedicAppointments;
  let fixture: ComponentFixture<MedicAppointments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicAppointments],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicAppointments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
