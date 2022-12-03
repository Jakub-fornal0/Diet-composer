import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMealDialogComponent } from './delete-meal-dialog.component';

describe('DeleteMealDialogComponent', () => {
  let component: DeleteMealDialogComponent;
  let fixture: ComponentFixture<DeleteMealDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteMealDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteMealDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
