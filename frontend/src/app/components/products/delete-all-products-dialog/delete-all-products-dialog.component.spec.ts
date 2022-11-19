import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAllProductsDialogComponent } from './delete-all-products-dialog.component';

describe('DeleteAllProductsDialogComponent', () => {
  let component: DeleteAllProductsDialogComponent;
  let fixture: ComponentFixture<DeleteAllProductsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteAllProductsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAllProductsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
