import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loginData } from '../../interfaces/login.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  loginForm: FormGroup;
  passwordIsHide: boolean = true;
  loginDataAreCorrect: boolean = true;
  loginData: loginData = { email: '', password: '' };

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  login() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
    } else {
      this.loginData.email = this.loginForm.get('email')?.value;
      this.loginData.password = this.loginForm.get('password')?.value;
      //
      // JAK BEDZIE BACKEND ZROBIC SERWIS DO LOGOWANIA I UZUPELNIC
      // JAK ZLE DANE WSTAWIC WIADOMOSC DO ERRORA
      // ZROBIC SERWIS LOCAL STORAGE
      // JAK ZALOGUJE WSTAWIC TOKEN DO LOCALSTORAGE
      //
    }
  }
}
