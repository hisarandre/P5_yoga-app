import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import {BehaviorSubject, of, throwError} from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { LoginComponent } from './login.component';
import { AuthService } from "../../services/auth.service";
import {SessionInformation} from "../../../../interfaces/sessionInformation.interface";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  const componentSelectors = {
    submitButton: '[data-testid="submit-button"]'
  };

  const mockLoginResponse: SessionInformation = {
    token: 'abc',
    type: "Bearer",
    id: 1,
    username: "test@test.com",
    firstName: "Test",
    lastName: "User",
    admin: true
  };

  const mockValidLoginData = {
    email: 'test@test.com',
    password: 'test!1234'
  };

  const mockSessionService = {
    sessionInformation: mockLoginResponse,
    logIn: jest.fn(),
    isLoggedSubject: new BehaviorSubject<boolean>(false),
  };

  const mockAuthService = {
    login: jest.fn().mockReturnValue(of(mockLoginResponse))
  };

  const setFormValues = (email: string = '', password: string = '') => {
    component.form.patchValue({ email, password });
    fixture.detectChanges();
  };

  const setValidForm = () => {
    component.form.setValue(mockValidLoginData);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
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
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation test suites', () => {

    it('should mark email as invalid when format is wrong', () => {
      // arrange
      const emailControl = component.form.get('email');

      // act
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();

      // assert
      expect(emailControl?.invalid).toBeTruthy();
      expect(emailControl?.errors?.['email']).toBeTruthy();
    });

    it('should mark form as valid when all inputs are correct', () => {
      // act
      setValidForm();

      // assert
      expect(component.form.valid).toBeTruthy();
    });

    it('should require email', () => {
      // arrange
      const emailControl = component.form.get('email');

      // act
      emailControl?.setValue('');
      emailControl?.markAsTouched();

      // assert
      expect(emailControl?.errors?.['required']).toBeTruthy();
    });

    it('should require password', () => {
      // arrange
      const passwordControl = component.form.get('password');

      // act
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();

      // assert
      expect(passwordControl?.errors?.['required']).toBeTruthy();
    });

    it('should disable submit button when form is invalid', () => {
      // act
      setFormValues('', mockValidLoginData.password);

      // assert
      const submitButton = fixture.nativeElement.querySelector(componentSelectors.submitButton) as HTMLButtonElement;
      expect(submitButton.disabled).toBeTruthy();
    });
  });

  describe('Login on submit test suites', () => {
    it('should call AuthService.login with form data', () => {
      // act
      setValidForm();
      component.submit();

      // assert
      expect(mockAuthService.login).toHaveBeenCalledWith(mockValidLoginData);
    });

    it('should call SessionService.logIn on successful auth', () => {
      mockAuthService.login.mockReturnValue(of(mockLoginResponse));
      // act
      setValidForm();
      component.submit();

      // assert
      expect(mockSessionService.logIn).toHaveBeenCalledWith(mockLoginResponse);
    });

    it('should navigate on successful login', () => {
      // arrange
      mockAuthService.login.mockReturnValue(of(mockLoginResponse));
      mockSessionService.logIn.mockReturnValue(of(mockLoginResponse));

      // act
      setValidForm();
      component.submit();

      // assert
      expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
    });

    it('should handle errors on failed login attempt', () => {
      // arrange
      const loginRequest = { email: "wrong@studio.com", password: "wrongpassword" };
      const errorResponse = new Error('Unauthorized');
      mockAuthService.login.mockReturnValue(throwError(() => errorResponse));

      // act
      component.form.setValue(loginRequest);
      component.submit();

      // assert
      expect(component.onError).toBe(true);
    });
  });
});
