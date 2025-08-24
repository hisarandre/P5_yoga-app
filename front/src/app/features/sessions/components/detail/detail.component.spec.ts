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
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionService: SessionService;
  let sessionApiService: jest.Mocked<SessionApiService>;
  let teacherService: jest.Mocked<TeacherService>;
  let matSnackBar: jest.Mocked<MatSnackBar>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  const componentSelectors = {
    deleteButton: '[data-testid="delete-button"]',
    participateButton: '[data-testid="participate-button"]',
    unParticipateButton: '[data-testid="unparticipate-button"]',
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 2,
    },
  };

  const mockTeacherService = {
    detail: jest.fn(),
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('1'),
      },
    },
  };

  const mockSession: Session = {
    id: 1,
    name: 'Yoga Session',
    description: 'Relaxing yoga session',
    date: new Date('2025-02-01'),
    teacher_id: 1,
    users: [3, 4],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of(mockSession)),
    delete: jest.fn().mockReturnValue(of(null)),
    participate: jest.fn().mockReturnValue(of(null)),
    unParticipate: jest.fn().mockReturnValue(of(null)),
  };

  const mockTeacher: Teacher = {
    id: 1,
    lastName: 'Test',
    firstName: 'Teacher',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatIconModule,
        MatCardModule,
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
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

  describe('Delete session test suites', () => {
    it('should show delete button if user is admin', () => {
      component.isAdmin = true;
      fixture.detectChanges();

      const deleteButton = fixture.nativeElement.querySelector(componentSelectors.deleteButton);
      expect(deleteButton?.textContent).toContain('Delete');
    });

    it('should not show delete button if user is not admin', () => {
      component.isAdmin = false;
      fixture.detectChanges();

      const deleteButton = fixture.nativeElement.querySelector(componentSelectors.deleteButton);
      expect(deleteButton).toBeNull();
    });
  });
});
