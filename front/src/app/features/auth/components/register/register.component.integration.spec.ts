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
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import {RegisterComponent} from "./register.component";
import {RegisterRequest} from "../../interfaces/registerRequest.interface";

// Mock component for routing
@Component({ template: '' })
class MockLoginComponent { }

describe('RegisterComponent Integration Test suites', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let location: Location;
  let sessionService: SessionService;

  const componentSelectors = {
    submitButton: '[data-testid="submit-button"]'
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

  const clickSubmitButton = () => {
    const submitButton = fixture.nativeElement.querySelector(componentSelectors.submitButton) as HTMLButtonElement;
    submitButton.click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent, MockLoginComponent],
      providers: [
        AuthService,
        SessionService
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: MockLoginComponent }
        ]),
        BrowserAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should register the user and redirect on the login page when submit a valid form', fakeAsync(() => {
    // arrange
    setValidForm()

    // act
    clickSubmitButton();

    // Simulate backend response
    const req = httpMock.expectOne('api/auth/register');
    req.flush({message:"User registered successfully!"}, { status: 200, statusText: 'OK' });
    tick();

    // assert
    // Verify form, session, navigation
    expect(component.onError).toBe(false);
    expect(component.form.valid).toBe(true);
    expect(location.path()).toBe('/login');
  }));
});
