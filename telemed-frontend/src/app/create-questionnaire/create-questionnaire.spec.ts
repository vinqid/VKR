import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestionnaire } from './create-questionnaire';

describe('CreateQuestionnaire', () => {
  let component: CreateQuestionnaire;
  let fixture: ComponentFixture<CreateQuestionnaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateQuestionnaire],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateQuestionnaire);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
