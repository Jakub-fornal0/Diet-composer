import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-recipes-filter-dialog',
  templateUrl: './recipes-filter-dialog.component.html',
  styleUrls: ['./recipes-filter-dialog.component.scss'],
})
export class RecipesFilterDialogComponent implements OnInit {
  public filterGroup: FormGroup;
  private filters: string[] = [
    'category',
    'level',
    'dietType',
    'portions',
    'cookingTime',
    'caloriesmin',
    'caloriesmax',
    'carbohydratesmin',
    'carbohydratesmax',
    'proteinsmin',
    'proteinsmax',
    'fatsmax',
    'fatsmin',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<RecipesFilterDialogComponent>
  ) {
    this.filterGroup = this.formBuilder.group({
      category: new FormControl(),
      level: new FormControl(),
      dietType: new FormControl(),
      portions: new FormControl(),
      cookingTime: new FormControl(),
      caloriesmin: new FormControl(),
      caloriesmax: new FormControl(),
      carbohydratesmin: new FormControl(),
      carbohydratesmax: new FormControl(),
      proteinsmin: new FormControl(),
      proteinsmax: new FormControl(),
      fatsmax: new FormControl(),
      fatsmin: new FormControl(),
    });
  }

  ngOnInit(): void {}

  public formIsValid(): boolean {
    if (
      this.filterGroup.get('portions')?.valid &&
      this.filterGroup.get('cookingTime')?.valid &&
      this.filterGroup.get('caloriesmin')?.valid &&
      this.filterGroup.get('caloriesmax')?.valid &&
      this.filterGroup.get('carbohydratesmin')?.valid &&
      this.filterGroup.get('carbohydratesmax')?.valid &&
      this.filterGroup.get('proteinsmin')?.valid &&
      this.filterGroup.get('proteinsmax')?.valid &&
      this.filterGroup.get('fatsmax')?.valid &&
      this.filterGroup.get('fatsmin')?.valid
    ) {
      return true;
    }
    return false;
  }

  public saveFilters(): void {
    let filtersString: string = '?';
    this.filters.forEach((filter) => {
      if (this.filterGroup.get(filter)?.value) {
        filtersString += filter;
        filtersString += '=';
        filtersString += this.filterGroup.get(filter)?.value;
        filtersString += '&';
      }
    });
    filtersString = filtersString.substring(0, filtersString.length - 1);
    this.dialogRef.close(filtersString);
  }
}
