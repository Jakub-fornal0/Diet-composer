import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOtherMealToScheduleComponent } from './add-other-meal-to-schedule.component';

describe('AddOtherMealToScheduleComponent', () => {
  let component: AddOtherMealToScheduleComponent;
  let fixture: ComponentFixture<AddOtherMealToScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOtherMealToScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOtherMealToScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
