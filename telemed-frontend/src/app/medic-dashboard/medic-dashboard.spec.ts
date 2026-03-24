import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicDashboard } from './medic-dashboard';

describe('MedicDashboard', () => {
  let component: MedicDashboard;
  let fixture: ComponentFixture<MedicDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
