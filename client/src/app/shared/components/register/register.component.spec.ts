import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when fields are empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should validate username field', () => {
    const username = component.registerForm.controls['username'];
    expect(username.valid).toBeFalsy();

    username.setValue('ab');
    expect(username.hasError('minlength')).toBeTruthy();

    username.setValue('abc');
    expect(username.valid).toBeTruthy();
  });

  it('should validate password field', () => {
    const password = component.registerForm.controls['password'];
    expect(password.valid).toBeFalsy();

    password.setValue('12345');
    expect(password.hasError('minlength')).toBeTruthy();

    password.setValue('123456');
    expect(password.valid).toBeTruthy();
  });

  it('should validate password confirmation match', () => {
    const password = component.registerForm.controls['password'];
    const confirmPassword = component.registerForm.controls['confirmPassword'];

    // First set the values
    password.setValue('password123');
    confirmPassword.setValue('password123');

    // Mark both fields as dirty and touched to trigger validation
    password.markAsDirty();
    confirmPassword.markAsDirty();
    password.markAsTouched();
    confirmPassword.markAsTouched();

    // Update the form itself
    component.registerForm.updateValueAndValidity();
    fixture.detectChanges();

    // Passwords match, so no passwordMismatch error
    expect(component.registerForm.hasError('passwordMismatch')).toBeFalsy();

    // Set different values
    confirmPassword.setValue('differentpassword');
    component.registerForm.updateValueAndValidity();
    fixture.detectChanges();

    // Now form should have passwordMismatch error
    expect(component.registerForm.hasError('passwordMismatch')).toBeTruthy();
  });

  it('should toggle password visibility when clicking the eye icon', () => {
    // Get password input and toggle button
    const passwordInput = fixture.debugElement.query(
      By.css('#password')
    ).nativeElement;
    const toggleButton = fixture.debugElement.query(
      By.css('.form-group:nth-child(2) .toggle-password')
    );

    // Initially password should be hidden
    expect(passwordInput.type).toBe('password');
    expect(component.showPassword).toBeFalse();

    // Click the toggle button
    toggleButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    // Password should now be visible
    expect(passwordInput.type).toBe('text');
    expect(component.showPassword).toBeTrue();

    // Click again to hide
    toggleButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    // Password should be hidden again
    expect(passwordInput.type).toBe('password');
    expect(component.showPassword).toBeFalse();
  });

  it('should toggle confirm password visibility when clicking its eye icon', () => {
    // Get confirm password input and toggle button
    const confirmPasswordInput = fixture.debugElement.query(
      By.css('#confirmPassword')
    ).nativeElement;
    const toggleButton = fixture.debugElement.query(
      By.css('.form-group:nth-child(3) .toggle-password')
    );

    // Initially confirm password should be hidden
    expect(confirmPasswordInput.type).toBe('password');
    expect(component.showConfirmPassword).toBeFalse();

    // Click the toggle button
    toggleButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    // Confirm password should now be visible
    expect(confirmPasswordInput.type).toBe('text');
    expect(component.showConfirmPassword).toBeTrue();

    // Click again to hide
    toggleButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    // Confirm password should be hidden again
    expect(confirmPasswordInput.type).toBe('password');
    expect(component.showConfirmPassword).toBeFalse();
  });

  it('should calculate password strength', () => {
    const password = component.registerForm.controls['password'];

    // Empty password
    password.setValue('');
    fixture.detectChanges();
    expect(component.passwordStrength).toBe('weak');
    expect(component.passwordStrengthPercent).toBe(0);

    // Short password
    password.setValue('abc');
    fixture.detectChanges();
    expect(component.passwordStrength).toBe('weak');
    expect(component.passwordStrengthPercent).toBe(33);

    // Medium complexity
    password.setValue('Abc123');
    fixture.detectChanges();
    expect(component.passwordStrength).toBe('medium');

    // High complexity
    password.setValue('Abc123!@#');
    fixture.detectChanges();
    expect(component.passwordStrength).toBe('strong');
    expect(component.passwordStrengthPercent).toBe(100);
  });

  it('should show password strength meter when password has value', () => {
    // Initially strength meter should not be visible
    let strengthMeter = fixture.debugElement.query(
      By.css('.password-strength')
    );
    expect(strengthMeter).toBeNull();

    // Enter a password
    component.registerForm.controls['password'].setValue('Abc123');
    fixture.detectChanges();

    // Now strength meter should be visible
    strengthMeter = fixture.debugElement.query(By.css('.password-strength'));
    expect(strengthMeter).not.toBeNull();

    // Check that strength class is applied
    const strengthBar = fixture.debugElement.query(By.css('.strength-bar'));
    expect(strengthBar.nativeElement.className).toContain('medium');
  });

  it('should update focused field when input is focused', () => {
    // Initially no field is focused
    expect(component.focusedField).toBeNull();

    // Focus username field
    const usernameInput = fixture.debugElement.query(By.css('#username'));
    usernameInput.triggerEventHandler('focus', null);

    // Username should be the focused field
    expect(component.focusedField).toBe('username');

    // Blur username field
    usernameInput.triggerEventHandler('blur', null);

    // No field should be focused
    expect(component.focusedField).toBeNull();
  });

  it('should submit form when valid', fakeAsync(() => {
    spyOn(console, 'log');

    // Set valid form values
    component.registerForm.controls['username'].setValue('validUser');
    component.registerForm.controls['password'].setValue('validPassword');
    component.registerForm.controls['confirmPassword'].setValue(
      'validPassword'
    );

    // Submit form
    component.onSubmit();
    expect(component.isSubmitting).toBeTrue();

    // Fast-forward time to complete the setTimeout
    tick(1500);
    fixture.detectChanges();

    // Should process registration
    expect(component.isSubmitting).toBeFalse();
    expect(console.log).toHaveBeenCalledWith('Form Submitted', {
      username: 'validUser',
      password: 'validPassword',
      confirmPassword: 'validPassword',
    });
  }));

  it('should not submit if form is invalid', () => {
    spyOn(console, 'log');

    // Form is invalid by default
    component.onSubmit();

    // Should not process submission
    expect(console.log).not.toHaveBeenCalled();
    expect(component.isSubmitting).toBeFalse();
  });

  it('should disable submit button when form is invalid', () => {
    const submitButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;

    // Form is invalid initially
    expect(submitButton.disabled).toBeTrue();

    // Make form valid
    component.registerForm.controls['username'].setValue('validUser');
    component.registerForm.controls['password'].setValue('validPassword');
    component.registerForm.controls['confirmPassword'].setValue(
      'validPassword'
    );
    fixture.detectChanges();

    // Button should be enabled
    expect(submitButton.disabled).toBeFalse();
  });

  it('should disable submit button and show spinner while submitting', fakeAsync(() => {
    // Make form valid
    component.registerForm.controls['username'].setValue('validUser');
    component.registerForm.controls['password'].setValue('validPassword');
    component.registerForm.controls['confirmPassword'].setValue(
      'validPassword'
    );
    fixture.detectChanges();

    // Submit form
    component.onSubmit();
    fixture.detectChanges();

    // Button should be disabled and show spinner
    const submitButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(submitButton.disabled).toBeTrue();
    expect(submitButton.classList.contains('loading')).toBeTrue();

    // Should show spinner
    const spinner = fixture.debugElement.query(By.css('.spinner'));
    expect(spinner).not.toBeNull();

    // Fast-forward time
    tick(1500);
    fixture.detectChanges();

    // Button should be enabled again and spinner should be gone
    expect(submitButton.disabled).toBeFalse();
    expect(submitButton.classList.contains('loading')).toBeFalse();
  }));
});
