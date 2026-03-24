import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireDetail } from './questionnaire-detail';

describe('QuestionnaireDetail', () => {
  let component: QuestionnaireDetail;
  let fixture: ComponentFixture<QuestionnaireDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionnaireDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionnaireDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
