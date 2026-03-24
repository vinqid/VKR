import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageParameters } from './manage-parameters';

describe('ManageParameters', () => {
  let component: ManageParameters;
  let fixture: ComponentFixture<ManageParameters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageParameters],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageParameters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
