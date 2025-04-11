import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class RegisterComponent {
  registerForm: FormGroup;
  focusedField: string | null = null;
  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;
  passwordStrength = 'weak';
  passwordStrengthPercent = 0;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );

    this.registerForm.get('password')?.valueChanges.subscribe((password) => {
      if (password) {
        this.calculatePasswordStrength(password);
      } else {
        this.passwordStrength = 'weak';
        this.passwordStrengthPercent = 0;
      }
    });
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password?.pristine || confirmPassword?.pristine) {
      return null;
    }

    return password &&
      confirmPassword &&
      password.value !== confirmPassword.value
      ? { passwordMismatch: true }
      : null;
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

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  calculatePasswordStrength(password: string): void {
    let strength = 0;

    if (password.length >= 8) {
      strength += 1;
    }
    if (password.length >= 12) {
      strength += 1;
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[^A-Za-z0-9]/.test(password);

    if (hasUppercase) strength += 1;
    if (hasLowercase) strength += 1;
    if (hasNumbers) strength += 1;
    if (hasSpecialChars) strength += 1;

    if (strength <= 2) {
      this.passwordStrength = 'weak';
      this.passwordStrengthPercent = 33;
    } else if (strength <= 4) {
      this.passwordStrength = 'medium';
      this.passwordStrengthPercent = 66;
    } else {
      this.passwordStrength = 'strong';
      this.passwordStrengthPercent = 100;
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isSubmitting = true;

      setTimeout(() => {
        console.log('Form Submitted', this.registerForm.value);
        this.isSubmitting = false;
      }, 1500);
    }
  }
}
