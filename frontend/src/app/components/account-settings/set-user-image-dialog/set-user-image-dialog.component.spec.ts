import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetUserImageDialogComponent } from './set-user-image-dialog.component';

describe('SetUserImageDialogComponent', () => {
  let component: SetUserImageDialogComponent;
  let fixture: ComponentFixture<SetUserImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetUserImageDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetUserImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
