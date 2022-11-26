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
  private filters: { ang: string; pl: string }[] = [
    { ang: 'category', pl: 'kategoria' },
    { ang: 'level', pl: 'poziom trudności' },
    { ang: 'dietType', pl: 'typ diety' },
    { ang: 'portions', pl: 'porcje' },
    { ang: 'cookingTime', pl: 'czas' },
    { ang: 'caloriesmin', pl: 'kalorie min' },
    { ang: 'caloriesmax', pl: 'kalorie max' },
    { ang: 'carbohydratesmin', pl: 'węglowodany min' },
    { ang: 'carbohydratesmax', pl: 'węglowodany max' },
    { ang: 'proteinsmin', pl: 'białka min' },
    { ang: 'proteinsmax', pl: 'białka max' },
    { ang: 'fatsmax', pl: 'tłuszcze min' },
    { ang: 'fatsmin', pl: 'tłuszcze min' },
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
    let filtersToDisplay: string = '';
    this.filters.forEach((filter) => {
      if (this.filterGroup.get(filter.ang)?.value) {
        filtersString += filter.ang;
        filtersString += '=';
        filtersString += this.filterGroup.get(filter.ang)?.value;
        filtersString += '&';

        filtersToDisplay += filter.pl;
        filtersToDisplay += ': ';
        filtersToDisplay += this.filterGroup.get(filter.ang)?.value;
        filtersToDisplay += ', ';
      }
    });
    filtersString = filtersString.substring(0, filtersString.length - 1);
    filtersToDisplay = filtersToDisplay.substring(
      0,
      filtersToDisplay.length - 1
    );
    filtersToDisplay = filtersToDisplay.substring(
      0,
      filtersToDisplay.length - 1
    );

    this.dialogRef.close({
      filtersString: filtersString,
      filtersToDisplay: filtersToDisplay,
    });
  }
}
