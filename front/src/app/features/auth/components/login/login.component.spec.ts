import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { LoginComponent } from './login.component';
import { AuthService } from "../../services/auth.service";

const mockAuthService = {
  login: jest.fn()
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let authService: jest.Mocked<AuthService>;

  const VALID_LOGIN_DATA = {
    email: 'test@test.com',
    password: 'test!1234'
  };

  const MOCK_LOGIN_RESPONSE = {
    token: 'abc',
    type: "Bearer",
    id: 1,
    username: "test@test.com",
    firstName: "Test",
    lastName: "Test",
    admin: true
  };

  // Helper functions
  const setFormValues = (email: string = '', password: string = '') => {
    component.form.patchValue({ email, password });
    fixture.detectChanges();
  };

  const setValidForm = () => {
    component.form.setValue(VALID_LOGIN_DATA);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        SessionService,
        { provide: AuthService, useValue: mockAuthService }
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;

    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

    fixture.detectChanges();
  });

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should init form with empty inputs', () => {
      expect(component.form.get('email')?.value).toBe('');
      expect(component.form.get('password')?.value).toBe('');
    });

    it('should mark form as invalid when inputs are empty', () => {
      expect(component.form.valid).toBeFalsy();
    });

    it('should mark email as invalid when format is wrong', () => {
      const emailControl = component.form.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();

      expect(emailControl?.invalid).toBeTruthy();
      expect(emailControl?.errors?.['email']).toBeTruthy();
    });

    it('should mark form as valid when all inputs are correct', () => {
      setValidForm();
      expect(component.form.valid).toBeTruthy();
    });

    it('should require email', () => {
      const emailControl = component.form.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();

      expect(emailControl?.errors?.['required']).toBeTruthy();
    });

    it('should require password', () => {
      const passwordControl = component.form.get('password');
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();

      expect(passwordControl?.errors?.['required']).toBeTruthy();
    });

    it('should disable submit button when form is invalid', () => {
      setFormValues('', VALID_LOGIN_DATA.password);

      const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
      expect(submitButton.nativeElement.disabled).toBeTruthy();
    });
  });

  describe('Form submit', () => {
    it('should call authService.login with form value when form is valid', () => {
      setValidForm();

      // Mock successful login
      authService.login.mockReturnValue(of(MOCK_LOGIN_RESPONSE));

      component.submit();

      expect(authService.login).toHaveBeenCalledWith(VALID_LOGIN_DATA);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    it('should update session and navigate on successful login', () => {
      setValidForm();

      // Mock successful login
      authService.login.mockReturnValue(of(MOCK_LOGIN_RESPONSE));

      const sessionSpy = jest.spyOn(component['sessionService'], 'logIn');
      const routerSpy = jest.spyOn(component['router'], 'navigate');

      component.submit();

      expect(sessionSpy).toHaveBeenCalledWith(MOCK_LOGIN_RESPONSE);
      expect(sessionSpy).toHaveBeenCalledTimes(1);
      expect(routerSpy).toHaveBeenCalledWith(['/sessions']);
    });

    it('should set onError to true if login fails', () => {
      setValidForm();

      // Mock failed login
      authService.login.mockReturnValue(throwError(() => new Error('Login failed')));

      component.submit();

      expect(component.onError).toBe(true);
    });
  });
});
