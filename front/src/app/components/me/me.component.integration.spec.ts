import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // Add this import
import { expect } from '@jest/globals';

import { MeComponent } from './me.component';
import { User } from '../../interfaces/user.interface';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import {SessionInformation} from "../../interfaces/sessionInformation.interface";

@Component({ template: '' })
class MockHomeComponent {}

describe('MeComponent Delete Integration Tests', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let sessionService: SessionService;
  let snackBar: MatSnackBar;
  let htmlElement: HTMLElement;

  const mockUser: User = {
    id: 1,
    email: 'test@test.com',
    lastName: 'Test',
    firstName: 'User',
    admin: false, // Non-admin user so delete button appears
    password: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const sessionInformation : SessionInformation = {
    token: 'abc',
    type: "Bearer",
    id: 1,
    username: "test@test.com",
    firstName: "Test",
    lastName: "User",
    admin: false
  };

  const componentSelectors = {
    deleteButton: '[data-testid="delete-account-button"]'
  };

  const clickDeleteButton = () => {
    const deleteButton = htmlElement.querySelector(componentSelectors.deleteButton) as HTMLButtonElement;
    deleteButton.click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent, MockHomeComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: MockHomeComponent }
        ]),
        HttpClientTestingModule,
        NoopAnimationsModule, // Add this module to disable animations in tests
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        SessionService,
        UserService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    htmlElement = fixture.nativeElement;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);
    snackBar = TestBed.inject(MatSnackBar);

    sessionService.sessionInformation = sessionInformation
    fixture.detectChanges();

    const getUserReq = httpMock.expectOne('api/user/1');
    getUserReq.flush(mockUser, { status: 200, statusText: 'OK' });
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should delete user, show snackbar, logout and navigate to home page', fakeAsync(() => {
    // arrange
    const snackBarSpy = jest.spyOn(snackBar, 'open');
    const logOutSpy = jest.spyOn(sessionService, 'logOut');
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    // act
    clickDeleteButton();

    // Simulate successful delete
    const deleteReq = httpMock.expectOne('api/user/1');
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush(
      { message: 'User deleted successfully' },
      { status: 200, statusText: 'OK' }
    );

    tick(3000);
    fixture.detectChanges();

    // assert
    expect(snackBarSpy).toHaveBeenCalledWith(
      'Your account has been deleted !',
      'Close',
      { duration: 3000 }
    );
    expect(logOutSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  }));

});
