import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { expect } from '@jest/globals';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jest.Mocked<AuthService>;
  let router: Router;

  const mockAuthService = {
    register: jest.fn()
  };

  const mockValidRegisterData= {
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
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


  describe('Form validation', () => {
    it('should enable submit button when all required fields are filled', () => {
      setValidForm();

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;

      expect(component.form.valid).toBe(true);
      expect(submitButton.disabled).toBe(false);
    });

    it('should mark email as invalid when format is wrong', () => {
      const emailControl = component.form.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();

      expect(emailControl?.invalid).toBeTruthy();
      expect(emailControl?.errors?.['email']).toBeTruthy();
    });

    it('should mark lastName as invalid when empty', () => {
      const lastNameControl = component.form.get('lastName');
      lastNameControl?.setValue('');
      lastNameControl?.markAsTouched();

      expect(lastNameControl?.invalid).toBeTruthy();
      expect(lastNameControl?.errors?.['required']).toBeTruthy();
    });

    it('should mark firstName as invalid when empty', () => {
      const firstNameControl = component.form.get('firstName');
      firstNameControl?.setValue('');
      firstNameControl?.markAsTouched();

      expect(firstNameControl?.invalid).toBeTruthy();
      expect(firstNameControl?.errors?.['required']).toBeTruthy();
    });

    it('should mark password as invalid when empty', () => {
      const passwordControl = component.form.get('password');
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();

      expect(passwordControl?.invalid).toBeTruthy();
      expect(passwordControl?.errors?.['required']).toBeTruthy();
    });
  });

  describe('Form submit', () => {
    it('should call authService.register when form is valid', () => {
      setValidForm();

      // Mock successful register
      authService.register.mockReturnValue(of(undefined));

      component.submit();

      expect(authService.register).toHaveBeenCalledWith(mockValidRegisterData);
      expect(authService.register).toHaveBeenCalledTimes(1);
    });

    it('should navigate to login on successful register', () => {
      setValidForm();

      authService.register.mockReturnValue(of(undefined));

      const routerSpy = jest.spyOn(router, 'navigate');

      component.submit();

      expect(routerSpy).toHaveBeenCalledWith(['/login']);
    });

    it('should set onError to true if register fails', () => {
      setValidForm();

      authService.register.mockReturnValue(throwError(() => new Error('Register failed')));

      component.submit();

      expect(component.onError).toBe(true);
    });
  });
});
