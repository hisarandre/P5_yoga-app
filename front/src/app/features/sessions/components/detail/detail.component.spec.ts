import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { Teacher } from '../../../../interfaces/teacher.interface';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';
import { DetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionService: SessionService;
  let sessionApiService: jest.Mocked<SessionApiService>;
  let teacherService: jest.Mocked<TeacherService>;
  let matSnackBar: jest.Mocked<MatSnackBar>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  };

  const mockTeacherService = {
    detail: jest.fn()
  };

  const mockMatSnackBar = {
    open: jest.fn()
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('1')
      }
    }
  };

  const mockSession: Session = {
    id: 1,
    name: 'Test Session',
    description: 'Test Description',
    date: new Date('2025-01-01'),
    teacher_id: 1,
    users: [1, 2],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of(mockSession)),
    delete: jest.fn().mockReturnValue(of(null)),
    participate: jest.fn().mockReturnValue(of(null)),
    unParticipate: jest.fn().mockReturnValue(of(null))
  };

  const mockTeacher: Teacher = {
    id: 1,
    lastName: 'Test',
    firstName: 'Teacher',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService) as jest.Mocked<SessionApiService>;
    teacherService = TestBed.inject(TeacherService) as jest.Mocked<TeacherService>;
    matSnackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);

    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Fetch session', () => {
    it('should fetch session and teacher details', () => {
      teacherService.detail.mockReturnValue(of(mockTeacher));

      component.ngOnInit();

      expect(sessionApiService.detail).toHaveBeenCalledWith('1');
      expect(teacherService.detail).toHaveBeenCalledWith('1');
      expect(component.session).toEqual(mockSession);
      expect(component.teacher).toEqual(mockTeacher);
    });

    it('should set isParticipate to true when user is in session users', () => {
      const sessionWithUser = { ...mockSession, users: [1, 2, 3] };
      sessionApiService.detail.mockReturnValue(of(sessionWithUser));
      teacherService.detail.mockReturnValue(of(mockTeacher));

      component.ngOnInit();

      expect(component.isParticipate).toBe(true);
    });

    it('should set isParticipate to false when user is not in session users', () => {
      const sessionWithoutUser = { ...mockSession, users: [2, 3] };
      sessionApiService.detail.mockReturnValue(of(sessionWithoutUser));
      teacherService.detail.mockReturnValue(of(mockTeacher));

      component.ngOnInit();

      expect(component.isParticipate).toBe(false);
    });
  });

  describe('Navigation', () => {
    it('should navigate back on back method call', () => {
      const backSpy = jest.spyOn(window.history, 'back');

      component.back();

      expect(backSpy).toHaveBeenCalled();
    });
  })

    describe('Delete session', () => {
    it('should call sessionApiService.delete when delete() is called', () => {
      component.delete();

      expect(sessionApiService.delete).toHaveBeenCalledWith('1');
      expect(sessionApiService.delete).toHaveBeenCalledTimes(1);
    });

    it('should show success message after deleting a session', () => {
      component.delete();

      expect(matSnackBar.open).toHaveBeenCalledTimes(1);
    });

    it('should navigate to sessions after deleting a session', () => {
      component.delete();

      expect(router.navigate).toHaveBeenCalledWith(['sessions']);
    });

      it('should show delete button if user is admin', () => {
        component.isAdmin = true;
        fixture.detectChanges();

        const deleteButton = fixture.nativeElement.querySelector('button[color="warn"] span');
        expect(deleteButton?.textContent).toContain('Delete');
      });

      it('should not show delete button if user is not admin', () => {
        component.isAdmin = false;
        fixture.detectChanges();

        const deleteButton = fixture.nativeElement.querySelector('button[color="warn"] span');
        expect(deleteButton).toBeNull();
      });
  });

  describe('Participate and unparticipate to a session', () => {
    it('should add user in session when participate() is called', () => {
      const sessionWithUser = { ...mockSession, users: [1, 2, 3] };
      sessionApiService.detail.mockReturnValue(of(sessionWithUser)); // Value after participate()

      component.participate();

      expect(component.isParticipate).toBe(true);
      expect(sessionApiService.participate)
        .toHaveBeenCalledWith(mockSession.id!.toString(), mockSessionService.sessionInformation.id.toString());
    });

    it('should remove user from session when unParticipate() is called', () => {
      const sessionWithoutUser = { ...mockSession, users: [2, 3] };
      sessionApiService.detail.mockReturnValue(of(sessionWithoutUser));  // Value after unParticipate()

      component.unParticipate();

      expect(component.isParticipate).toBe(false);
      expect(sessionApiService.unParticipate)
        .toHaveBeenCalledWith(mockSession.id!.toString(), mockSessionService.sessionInformation.id.toString());
    });
  });
});
