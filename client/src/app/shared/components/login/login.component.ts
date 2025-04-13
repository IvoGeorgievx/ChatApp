import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { finalize, tap } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class LoginComponent {
  focusedField: string | null = null;
  showPassword = false;
  isSubmitting = false;
  loginError = '';
  rememberMe = false;
  cookieOptions: CookieOptions = {
    expires: 3,
    path: '/',
    secure: false, //should be true in prod,
    sameSite: 'Lax',
  };

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cookieService = inject(CookieService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onFocusField(fieldName: string): void {
    this.focusedField = fieldName;
  }

  onBlurField(): void {
    this.focusedField = null;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.loginError = '';

      this.authService
        .login(this.loginForm.value)
        .pipe(
          tap((value) => console.log(value)),
          finalize(() => (this.isSubmitting = false))
        )
        .subscribe((response) => {
          const decodedToken = jwtDecode(response.accessToken);

          let currentCookieOptions = { ...this.cookieOptions };
          if (this.rememberMe && decodedToken.exp) {
            const expiryDate = new Date(decodedToken.exp * 1000);
            currentCookieOptions.expires = expiryDate;
          } else {
            delete currentCookieOptions.expires;
          }
          this.cookieService.set(
            'accessToken',
            response.accessToken,
            currentCookieOptions
          );
          this.router.navigate(['/']);
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
