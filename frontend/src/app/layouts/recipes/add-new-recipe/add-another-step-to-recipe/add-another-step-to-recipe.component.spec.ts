import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnotherStepToRecipeComponent } from './add-another-step-to-recipe.component';

describe('AddAnotherStepToRecipeComponent', () => {
  let component: AddAnotherStepToRecipeComponent;
  let fixture: ComponentFixture<AddAnotherStepToRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAnotherStepToRecipeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAnotherStepToRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
