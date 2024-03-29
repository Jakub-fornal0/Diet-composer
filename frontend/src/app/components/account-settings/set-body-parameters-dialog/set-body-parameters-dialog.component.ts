import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-set-body-parameters-dialog',
  templateUrl: './set-body-parameters-dialog.component.html',
  styleUrls: ['./set-body-parameters-dialog.component.scss'],
})
export class SetBodyParametersDialogComponent implements OnInit {
  public bodyParametersForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<SetBodyParametersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.bodyParametersForm = this.formBuilder.group({
      age: [data.age, [Validators.required]],
      gender: [data.gender, [Validators.required, Validators.minLength(2)]],
      weight: [data.weight, [Validators.required]],
      height: [data.height, [Validators.required]],
      dietPurpose: [
        data.dietPurpose,
        [Validators.required, Validators.minLength(2)],
      ],
      physicalActivity: [
        data.physicalActivity,
        [Validators.required, Validators.minLength(2)],
      ],
    });
  }

  ngOnInit(): void {}

  public saveBodyParameters(): void {
    this.dialogRef.close(this.bodyParametersForm.value);
  }
}
