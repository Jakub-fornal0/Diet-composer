import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipeStep } from '../../../../interfaces/recipe.model';

@Component({
  selector: 'app-add-another-step-to-recipe',
  templateUrl: './add-another-step-to-recipe.component.html',
  styleUrls: ['./add-another-step-to-recipe.component.scss'],
})
export class AddAnotherStepToRecipeComponent implements OnInit {
  public recipeStepForm: FormGroup;

  @Input() index: number = 0;
  @Input() recipeStep: RecipeStep = { id: 0, name: '' };
  @Output() returnRecipeStepData = new EventEmitter<RecipeStep>();
  @Output() recipeStepToDelete = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.recipeStepForm = this.formBuilder.group({
      name: ['', Validators.required],
    });

    this.recipeStepForm.valueChanges.subscribe(() => {
      this.returnRecipeStepData.emit(this.recipeStepForm.value);
    });
  }

  ngOnInit(): void {
    this.recipeStepForm.get('name')?.setValue(this.recipeStep.name);
  }

  public deleteRecipeStep(): void {
    this.recipeStepToDelete.emit();
  }
}
