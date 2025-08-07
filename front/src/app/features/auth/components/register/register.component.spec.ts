import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { expect } from '@jest/globals';
import {RegisterRequest} from "../../interfaces/registerRequest.interface";
import {of} from "rxjs";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jest.Mocked<AuthService>;
  let router: Router;

  const componentSelectors = {
    submitButton: '[data-testid="submit-button"]'
  };

  const mockAuthService = {
    register: jest.fn().mockReturnValue(of(void 0))
  };

  const mockValidRegisterData : RegisterRequest = {
    email: 'test@test.com',
    firstName: 'User',
    lastName: 'Test',
    password: 'test!1234'
  };

  const setValidForm = () => {
    component.form.setValue(mockValidRegisterData);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router);

    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    jest.clearAllMocks();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form validation test suites', () => {
    it('should enable submit button when all required fields are filled', () => {
      //act
      setValidForm();
      const submitButton = fixture.nativeElement.querySelector(componentSelectors.submitButton) as HTMLButtonElement;

      // assert
      expect(component.form.valid).toBe(true);
      expect(submitButton.disabled).toBe(false);
    });

    it('should initialize form with required validators', () => {
      // arrange
      const emailControl = component.form.get('email');
      const passwordControl = component.form.get('password');
      const firstNameControl = component.form.get('firstName');
      const lastNameControl = component.form.get('lastName');

      // act
      emailControl?.setValue('');
      passwordControl?.setValue('');
      lastNameControl?.setValue('');
      firstNameControl?.setValue('');

      emailControl?.markAsTouched();
      passwordControl?.markAsTouched();
      lastNameControl?.markAsTouched();
      firstNameControl?.markAsTouched();

      // assert
      expect(emailControl?.hasError('required')).toBe(true);
      expect(passwordControl?.hasError('required')).toBe(true);
      expect(lastNameControl?.hasError('required')).toBe(true);
      expect(firstNameControl?.hasError('required')).toBe(true);
    });

    it('should initialize form with email validator', () => {
      // arrange
      const emailControl = component.form.get('email');

      // act
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();

      // assert
      expect(emailControl?.hasError('email')).toBe(true);
    });
  });

  describe('Register on submit test suites', () => {
    it('should call AuthService.register with form data', () => {
      // act
      setValidForm();
      component.submit();

      // assert
      expect(mockAuthService.register).toHaveBeenCalledWith(mockValidRegisterData);
    });

    it('should navigate on successful register', () => {
      // act
      setValidForm();
      component.submit();

      // assert
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
