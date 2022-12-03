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
  private filters: { ang: string; pl: string; unit: string }[] = [
    { ang: 'category', pl: 'kategoria', unit: '' },
    { ang: 'level', pl: 'poziom trudności', unit: '' },
    { ang: 'dietType', pl: 'typ diety', unit: '' },
    { ang: 'portions', pl: 'porcje', unit: '' },
    { ang: 'cookingTime', pl: 'czas', unit: 'min' },
    { ang: 'caloriesmin', pl: 'kalorie min', unit: 'kcal' },
    { ang: 'caloriesmax', pl: 'kalorie max', unit: 'kcal' },
    { ang: 'carbohydratesmin', pl: 'węglowodany min', unit: 'g' },
    { ang: 'carbohydratesmax', pl: 'węglowodany max', unit: 'g' },
    { ang: 'proteinsmin', pl: 'białka min', unit: 'g' },
    { ang: 'proteinsmax', pl: 'białka max', unit: 'g' },
    { ang: 'fatsmax', pl: 'tłuszcze min', unit: 'g' },
    { ang: 'fatsmin', pl: 'tłuszcze min', unit: 'g' },
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
    let filtersString: string = '&';
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
        filtersToDisplay += filter.unit;
        filtersToDisplay += ', ';
      }
    });

    filtersString = filtersString.substring(0, filtersString.length - 1);
    filtersToDisplay = filtersToDisplay.substring(
      0,
      filtersToDisplay.length - 2
    );

    this.dialogRef.close({
      filtersString: filtersString,
      filtersToDisplay: filtersToDisplay,
    });
  }
}
