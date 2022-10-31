import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { loginData } from '../../interfaces/login.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  loginForm: FormGroup;
  passwordIsHide: boolean = true;
  loginData: loginData = { email: '', password: '' };
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  login() {
    this.error = '';
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
    } else {
      this.loginData.email = this.loginForm.get('email')?.value;
      this.loginData.password = this.loginForm.get('password')?.value;

      this.authService.login(this.loginData).subscribe({
        next: (res) => {
          if (res === false) {
            this.error = 'Wprowadzony email lub hasło są nieprawidłowe.';
          } else {
            this.router.navigate(['/']);
          }
        },
      });
    }
  }
}
