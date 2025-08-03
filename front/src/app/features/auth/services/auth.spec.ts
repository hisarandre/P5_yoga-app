import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { expect } from '@jest/globals';

describe('AuthService', () => {
  let httpMock: HttpTestingController;
  let authService: AuthService;

  const mockRegisterRequest: RegisterRequest = {
    email: 'test@test.com',
    firstName: 'test',
    lastName: 'user',
    password: 'test!1234',
  };

  const mockLoginRequest: LoginRequest = {
    email: 'test@test.com',
    password: 'test!1234',
  };

  const mockSessionInformation: SessionInformation = {
    token: 'abc',
    type: "Bearer",
    id: 1,
    username: "test@test.com",
    firstName: "Test",
    lastName: "Test",
    admin: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should call register and return void', () => {
    authService.register(mockRegisterRequest).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterRequest);
    req.flush(null);
  });

  it('should call login and return session information', () => {
    authService.login(mockLoginRequest).subscribe(response => {
      expect(response).toEqual(mockSessionInformation);
    });

    const req = httpMock.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLoginRequest);
    req.flush(mockSessionInformation);
  });

  it('should handle register error', () => {
    authService.register(mockRegisterRequest).subscribe({
      next: () => fail('Expected an error, not success'),
      error: (error) => {
        expect(error.status).toBe(400);
      }
    });

    const req = httpMock.expectOne('api/auth/register');
    req.flush('Registration failed', { status: 400, statusText: 'Bad Request' });
  });

  it('should handle login error', () => {
    authService.login(mockLoginRequest).subscribe({
      next: () => fail('Expected an error, not success'),
      error: (error) => {
        expect(error.status).toBe(401);
      }
    });

    const req = httpMock.expectOne('api/auth/login');
    req.flush('Invalid credentials', { status: 401, statusText: 'Unauthorized' });
  });
});
