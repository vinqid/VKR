import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientQuestionnaires } from './patient-questionnaires';

describe('PatientQuestionnaires', () => {
  let component: PatientQuestionnaires;
  let fixture: ComponentFixture<PatientQuestionnaires>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientQuestionnaires],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientQuestionnaires);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
