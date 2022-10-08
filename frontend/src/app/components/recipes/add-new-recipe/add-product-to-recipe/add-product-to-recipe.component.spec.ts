import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductToRecipeComponent } from './add-product-to-recipe.component';

describe('AddProductToRecipeComponent', () => {
  let component: AddProductToRecipeComponent;
  let fixture: ComponentFixture<AddProductToRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductToRecipeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductToRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
