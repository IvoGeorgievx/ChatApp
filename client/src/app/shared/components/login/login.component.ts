import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
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

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
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
        .login(this.loginForm.value, this.rememberMe)
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: () => this.router.navigate(['/']),
          error: (err) => {
            this.loginError = err.message;
          },
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
