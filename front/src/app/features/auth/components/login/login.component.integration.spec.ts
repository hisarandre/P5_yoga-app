import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { expect } from '@jest/globals';
import { Component, NgZone } from '@angular/core';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { SessionInformation } from '../../../../interfaces/sessionInformation.interface';
import {throwError} from "rxjs";
import {LoginRequest} from "../../interfaces/loginRequest.interface";

// Mock component for routing
@Component({ template: '' })
class MockSessionsComponent { }

describe('LoginComponent Integration Test suites', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let location: Location;
  let sessionService: SessionService;

  const componentSelectors = {
    submitButton: '[data-testid="submit-button"]'
  };

  const mockLoginRequest : LoginRequest = {
    email: 'test@test.com',
    password: 'test!1234'
  };

  const mockSessionInformation: SessionInformation = {
    token: 'abc123',
    type: 'Bearer',
    id: 1,
    username: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
    admin: false
  };

  const setFormValues = (email: string, password: string) => {
    component.form.patchValue({
      email: email,
      password: password
    });
    fixture.detectChanges();
  };

  const clickSubmitButton = () => {
    const submitButton = fixture.nativeElement.querySelector(componentSelectors.submitButton) as HTMLButtonElement;
    submitButton.click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent, MockSessionsComponent],
      providers: [
        AuthService,
        SessionService
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'sessions', component: MockSessionsComponent }
        ]),
        BrowserAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    sessionService = TestBed.inject(SessionService);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should log the user and redirect when submit a valid form', fakeAsync(() => {
    // arrange
    setFormValues(mockLoginRequest.email, mockLoginRequest.password);

    // act
    clickSubmitButton();

    // Simulate backend response
    const req = httpMock.expectOne('api/auth/login');
    req.flush(mockSessionInformation);
    tick();

    // assert
    // Verify form, session, navigation
    expect(component.onError).toBe(false);
    expect(component.form.valid).toBe(true);
    expect(sessionService.isLogged).toBe(true);
    expect(sessionService.sessionInformation).toEqual(mockSessionInformation);
    expect(location.path()).toBe('/sessions');
  }));

  it('should show error message when login fails', fakeAsync(() => {
    // arrange
    setFormValues(mockLoginRequest.email, 'wrongpassword');

    // act
    clickSubmitButton();
    const req = httpMock.expectOne('api/auth/login');
    req.flush({}, { status: 400, statusText: 'Bad Request' });
    tick();

    // assert
    expect(component.onError).toBe(true);
    expect(sessionService.isLogged).toBe(false);
    expect(location.path()).toBe('');
  }));
});
