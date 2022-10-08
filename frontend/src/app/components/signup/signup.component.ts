import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { registerData } from '../../interfaces/register.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  passwordIsHide: boolean = true;
  registerDataAreCorrect: boolean = true;
  registerData: registerData = { userName: '', email: '', password: '' };
  error: string = '';

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  register() {
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
    } else {
      this.registerData.userName = this.registerForm.get('name')?.value;
      this.registerData.email = this.registerForm.get('email')?.value;
      this.registerData.password = this.registerForm.get('password')?.value;
      //
      // JAK BEDZIE BACKEND ZROBIC SERWIS DO REJESTRACJI I UZUPELNIC
      // JAK ZLE DANE WSTAWIC WIADOMOSC DO ERRORA
      //
    }
  }
}
