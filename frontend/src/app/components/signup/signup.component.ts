import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { registerData } from '../../interfaces/register.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  passwordIsHide: boolean = true;
  registerData: registerData = { userName: '', email: '', password: '' };
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  register() {
    this.error = '';
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
    } else {
      this.registerData.userName = this.registerForm.get('name')?.value;
      this.registerData.email = this.registerForm.get('email')?.value;
      this.registerData.password = this.registerForm.get('password')?.value;

      this.authService.userRegister(this.registerData).subscribe({
        error: (err) => {
          if (err.status === 400) {
            this.error = 'Niepoprawny adres email.';
          }
          if (err.status === 409) {
            this.error = 'Użytkownik o takim emailu istnieje!';
          }
        },
        complete: () => this.router.navigate(['/login']),
      });
    }
  }
}
