import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when fields are empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate username field', () => {
    const username = component.loginForm.controls['username'];
    expect(username.valid).toBeFalsy();

    username.setValue('ab');
    expect(username.hasError('minlength')).toBeTruthy();

    username.setValue('abc');
    expect(username.valid).toBeTruthy();
  });

  it('should validate password field', () => {
    const password = component.loginForm.controls['password'];
    expect(password.valid).toBeFalsy();

    password.setValue('');
    expect(password.hasError('required')).toBeTruthy();

    password.setValue('password123');
    expect(password.valid).toBeTruthy();
  });

  it('should toggle password visibility when clicking the eye icon', () => {
    // Get password input and toggle button
    const passwordInput = fixture.debugElement.query(
      By.css('#password')
    ).nativeElement;
    const toggleButton = fixture.debugElement.query(By.css('.toggle-password'));

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

  it('should toggle remember me when clicked', () => {
    // Get the remember me checkbox
    const rememberMeCheckbox = fixture.debugElement.query(
      By.css('.custom-checkbox')
    );

    // Initially it should be unchecked
    expect(component.rememberMe).toBeFalse();
    expect(component.loginForm.get('rememberMe')?.value).toBeFalse();

    // Click the checkbox
    rememberMeCheckbox.triggerEventHandler('click', null);
    fixture.detectChanges();

    // Should now be checked
    expect(component.rememberMe).toBeTrue();
    expect(component.loginForm.get('rememberMe')?.value).toBeTrue();
  });

  it('should show error message for invalid login', fakeAsync(() => {
    // Mock Math.random to always return 0.8 (which will trigger the error condition)
    spyOn(Math, 'random').and.returnValue(0.8);

    // Set valid form values
    component.loginForm.controls['username'].setValue('validUser');
    component.loginForm.controls['password'].setValue('password123');

    // Submit form
    component.onSubmit();
    expect(component.isSubmitting).toBeTrue();

    // Fast-forward time to complete the setTimeout
    tick(1500);
    fixture.detectChanges();

    // Should show error message
    expect(component.loginError).toBe('Invalid username or password');
    expect(component.isSubmitting).toBeFalse();

    const errorBanner = fixture.debugElement.query(By.css('.error-banner'));
    expect(errorBanner).toBeTruthy();
  }));

  it('should successfully process valid login', fakeAsync(() => {
    // Mock Math.random to return 0.5 (below the error threshold)
    spyOn(Math, 'random').and.returnValue(0.5);
    spyOn(console, 'log');

    // Set valid form values
    component.loginForm.controls['username'].setValue('validUser');
    component.loginForm.controls['password'].setValue('password123');

    // Submit form
    component.onSubmit();
    expect(component.isSubmitting).toBeTrue();

    // Fast-forward time to complete the setTimeout
    tick(1500);
    fixture.detectChanges();

    // Should process successful login
    expect(component.loginError).toBeNull();
    expect(component.isSubmitting).toBeFalse();
    expect(console.log).toHaveBeenCalledWith('Login Submitted', {
      username: 'validUser',
      password: 'password123',
      rememberMe: false,
    });
  }));

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
});
