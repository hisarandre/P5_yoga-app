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
import {SessionInformation} from "../../../../interfaces/sessionInformation.interface";

const mockAuthService = {
  login: jest.fn()
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let authService: jest.Mocked<AuthService>;

  const mockValidLoginData = {
    email: 'test@test.com',
    password: 'test!1234'
  };

  const mockLoginResponse: SessionInformation = {
    token: 'abc',
    type: "Bearer",
    id: 1,
    username: "test@test.com",
    firstName: "Test",
    lastName: "Test",
    admin: true
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
    jest.clearAllMocks();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {

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
      setFormValues('', mockValidLoginData.password);

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(submitButton.disabled).toBeTruthy();
    });
  });

  describe('Form submit', () => {
    it('should call authService.login when form is valid', () => {
      setValidForm();

      // Mock successful login
      authService.login.mockReturnValue(of(mockLoginResponse));

      component.submit();

      expect(authService.login).toHaveBeenCalledWith(mockValidLoginData);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    it('should update session and navigate on successful login', () => {
      setValidForm();

      // Mock successful login
      authService.login.mockReturnValue(of(mockLoginResponse));

      const sessionSpy = jest.spyOn(component['sessionService'], 'logIn');
      const routerSpy = jest.spyOn(component['router'], 'navigate');

      component.submit();

      expect(sessionSpy).toHaveBeenCalledWith(mockLoginResponse);
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
