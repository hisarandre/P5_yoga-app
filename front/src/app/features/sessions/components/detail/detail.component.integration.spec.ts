import {ComponentFixture, TestBed, fakeAsync, tick, flush} from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { expect } from '@jest/globals';
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DetailComponent } from './detail.component';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';
import { SessionService } from '../../../../services/session.service';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from '../../../../interfaces/teacher.interface';


describe('DetailComponent Integration Tests - Participate/Unparticipate', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let location: Location;
  let sessionService: SessionService;

  const componentSelectors = {
    participateButton: '[data-testid="participate-button"]',
    unParticipateButton: '[data-testid="unparticipate-button"]',
    deleteButton: '[data-testid="delete-button"]'
  };

  const mockSessionService = {
    sessionInformation: {
      admin: false,
      id: 2 // User ID 2 for testing
    }
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('1') // Session ID 1
      }
    }
  };

  const mockSession: Session = {
    id: 1,
    name: 'Yoga Session',
    description: 'Relaxing yoga session',
    date: new Date('2025-02-01'),
    teacher_id: 1,
    users: [3, 4], // User 2 is NOT participating initially
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockSessionWithUser: Session = {
    ...mockSession,
    users: [2, 3, 4] // User 2 is participating after join
  };

  const mockSessionWithoutUser: Session = {
    ...mockSession,
    users: [3, 4] // User 2 is not participating after leave
  };

  const mockTeacher: Teacher = {
    id: 1,
    lastName: 'Smith',
    firstName: 'John',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const clickParticipateButton = () => {
    const participateButton = fixture.nativeElement.querySelector(componentSelectors.participateButton) as HTMLButtonElement;
    participateButton?.click();
    fixture.detectChanges();
  };

  const clickUnparticipateButton = () => {
    const unparticipateButton = fixture.nativeElement.querySelector(componentSelectors.unParticipateButton) as HTMLButtonElement;
    unparticipateButton?.click();
    fixture.detectChanges();
  };

  const clickDeleteButton = () => {
    const deleteButton = fixture.nativeElement.querySelector(componentSelectors.deleteButton) as HTMLButtonElement;
    deleteButton?.click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailComponent],
      providers: [
        SessionApiService,
        TeacherService,
        { provide: SessionService, useValue: mockSessionService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'sessions', component: class MockSessionsComponent {} }
        ]),
        MatCardModule,
        MatIconModule,
        MatSnackBarModule,
        MatButtonModule,
        ReactiveFormsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
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

  describe('User participation integration tests', () => {

    it('should add the user to the participants when clicking on the participate button', fakeAsync(() => {
      // arrange - Init component with session where user is NOT participating
      const detailReq = httpMock.expectOne('api/session/1');
      detailReq.flush(mockSession);

      const teacherReq = httpMock.expectOne('api/teacher/1');
      teacherReq.flush(mockTeacher);

      tick();
      fixture.detectChanges();

      // Verify the user is not participating
      expect(component.isParticipate).toBe(false);

      // act - User clicks participate button
      clickParticipateButton();

      // Simulate successful API call
      const participateReq = httpMock.expectOne('api/session/1/participate/2');
      expect(participateReq.request.method).toBe('POST');
      participateReq.flush(null);

      const updatedDetailReq = httpMock.expectOne('api/session/1');
      updatedDetailReq.flush(mockSessionWithUser);

      const updatedTeacherReq = httpMock.expectOne('api/teacher/1');
      updatedTeacherReq.flush(mockTeacher);

      tick();
      fixture.detectChanges();

      // assert
      expect(component.isParticipate).toBe(true);
      expect(component.session?.users).toContain(2);
      expect(component.session?.users.length).toBe(3);
    }));

    it('should remove the user to the participants when clicking on the unparticipate button', fakeAsync(() => {
      // arrange - Init component with session where user IS participating
      const detailReq = httpMock.expectOne('api/session/1');
      detailReq.flush(mockSessionWithUser);

      const teacherReq = httpMock.expectOne('api/teacher/1');
      teacherReq.flush(mockTeacher);

      tick();
      fixture.detectChanges();

      // Verify the user is participating
      expect(component.isParticipate).toBe(true);

      // act - User clicks unparticipate button
      clickUnparticipateButton();

      // Simulate successful API call
      const unparticipateReq = httpMock.expectOne('api/session/1/participate/2');
      expect(unparticipateReq.request.method).toBe('DELETE');
      unparticipateReq.flush(null);

      const updatedDetailReq = httpMock.expectOne('api/session/1');
      updatedDetailReq.flush(mockSessionWithoutUser);

      const updatedTeacherReq = httpMock.expectOne('api/teacher/1');
      updatedTeacherReq.flush(mockTeacher);

      tick();
      fixture.detectChanges();

      // assert
      expect(component.isParticipate).toBe(false);
      expect(component.session?.users).not.toContain(2);
      expect(component.session?.users.length).toBe(2);
    }));

    it('should delete session, show snackbar and navigate to sessions page when admin clicks delete', fakeAsync(() => {
      // arrange
      const detailReq = httpMock.expectOne('api/session/1');
      detailReq.flush(mockSession);

      const teacherReq = httpMock.expectOne('api/teacher/1');
      teacherReq.flush(mockTeacher);

      tick();
      fixture.detectChanges();

      // Set component to admin for this test
      component.isAdmin = true;
      fixture.detectChanges();

      const snackBarSpy = jest.spyOn(component['matSnackBar'], 'open');

      // act
      clickDeleteButton();

      const deleteReq = httpMock.expectOne('api/session/1');
      expect(deleteReq.request.method).toBe('DELETE');
      deleteReq.flush({ message: 'Session deleted successfully' });

      tick();
      tick(3000); // snackbar duration
      fixture.detectChanges();

      // assert
      expect(snackBarSpy).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
      expect(location.path()).toBe('/sessions');

      flush();
    }));

    it('should not show delete button when user is not admin', fakeAsync(() => {
      // arrange
      const detailReq = httpMock.expectOne('api/session/1');
      detailReq.flush(mockSession);

      const teacherReq = httpMock.expectOne('api/teacher/1');
      teacherReq.flush(mockTeacher);

      tick();
      fixture.detectChanges();

      component.isAdmin = false;
      fixture.detectChanges();

      // act & assert
      const deleteButton = fixture.nativeElement.querySelector(componentSelectors.deleteButton) as HTMLButtonElement;
      expect(deleteButton).toBeNull();
      httpMock.expectNone('api/session/1');

      flush();
    }));
  });
});
