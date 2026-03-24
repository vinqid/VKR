import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicQuestionnaires } from './medic-questionnaires';

describe('MedicQuestionnaires', () => {
  let component: MedicQuestionnaires;
  let fixture: ComponentFixture<MedicQuestionnaires>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicQuestionnaires],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicQuestionnaires);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
