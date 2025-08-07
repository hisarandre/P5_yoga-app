import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { of } from 'rxjs';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';

@Component({ template: '' })
class MockSessionsComponent {}

describe('FormComponent Integration', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let location: Location;
  let snackBar: MatSnackBar;

  const componentSelectors = {
    submitButton: '[data-testid="submit-button"]'
  };

  const validFormData = {
    name: 'New Session',
    description: 'New Description',
    date: '2025-01-01',
    teacher_id: 2
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  };

  const mockTeacherService = {
    all: () => of([])
  };

  const clickOnSubmitButton = () => {
    const submitButton = fixture.nativeElement.querySelector(componentSelectors.submitButton) as HTMLButtonElement;
    submitButton?.click();
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormComponent, MockSessionsComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'sessions', component: MockSessionsComponent }
        ]),
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        NoopAnimationsModule,
        MatIconModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: TeacherService, useValue: mockTeacherService },
        SessionApiService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    httpMock = TestBed.inject(HttpTestingController);
    snackBar = TestBed.inject(MatSnackBar);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a new session, show snackbar and navigate to /sessions', fakeAsync(() => {
    // arrange
    component.sessionForm!.setValue(validFormData);
    fixture.detectChanges();

    // Spy snackbar open
    const snackBarSpy = jest.spyOn(snackBar, 'open');

    // act
    clickOnSubmitButton();

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(validFormData);
    req.flush({ message: 'Session created successfully!' });

    tick();
    tick(3000); // time of the snackbar
    fixture.detectChanges();

    // assert
    expect(snackBarSpy).toHaveBeenCalledWith('Session created !', 'Close', { duration: 3000 });
    expect(location.path()).toBe('/sessions');
  }));

  it('should update existing session, show snackbar and navigate to /sessions', fakeAsync(() => {
    // arrange
    const sessionId = '1';
    const updatedData = {
      name: 'Updated Name',
      description: 'Updated Description',
      date: '2025-01-01',
      teacher_id: 2
    };

    component.onUpdate = true;
    component.id = sessionId;
    component.sessionForm!.setValue(updatedData);
    fixture.detectChanges();

    const snackBarSpy = jest.spyOn(snackBar, 'open');

    // act
    clickOnSubmitButton();

    const req = httpMock.expectOne(`api/session/${sessionId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedData);
    req.flush({ message: 'Session updated!' });

    tick();
    tick(3000);
    fixture.detectChanges();

    // assert
    expect(snackBarSpy).toHaveBeenCalledWith('Session updated !', 'Close', { duration: 3000 });
    expect(location.path()).toBe('/sessions');
  }));
});
