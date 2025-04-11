import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  focusedField: string | null = null;
  showPassword = false;
  isSubmitting = false;
  loginError = '';
  rememberMe = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

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

      setTimeout(() => {
        const username = this.loginForm.get('username')?.value;
        console.log('Login attempted with:', this.loginForm.value);

        if (username === 'error') {
          this.loginError = 'Invalid username or password. Please try again.';
        }

        this.isSubmitting = false;
      }, 1500);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
