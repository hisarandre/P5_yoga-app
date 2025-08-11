import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect, it } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockSessionApiService: jest.Mocked<SessionApiService>;
  let mockSessionService: any;
  let mockRouter: any;

  const mockSession = {
    id: 1,
    name: 'Test Session',
    description: 'Test Description',
    date: new Date('2025-01-01'),
    teacher_id: 2,
    users: [1],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockNewSession = {
    name: 'New Session',
    date: new Date('2025-01-01'),
    teacher_id: 2,
    description: 'New Description'
  };

  const mockUpdateSession = {
    name: 'Update name',
    description: 'Update description',
    date: new Date('2025-01-01'),
    teacher_id: 2
  };

  beforeEach(async () => {
    mockSessionService = {
      sessionInformation: {
        admin: true
      }
    };

    const mockSessionApiServiceMethods = {
      detail: jest.fn().mockReturnValue(of(mockSession)),
      create: jest.fn().mockReturnValue(of(mockNewSession)),
      update: jest.fn().mockReturnValue(of(mockUpdateSession))
    };

    const mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue(mockSession.id.toString())
        },
        root: {}
      }
    };

    mockRouter = {
      navigate: jest.fn(),
      url: '/sessions/create'
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiServiceMethods },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ],
      declarations: [FormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    mockSessionApiService = TestBed.inject(SessionApiService) as jest.Mocked<SessionApiService>;

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form session initialization', () => {

    it('should init form in update mode', () => {
      // arrange
      mockRouter.url = '/sessions/update/1';
      fixture.detectChanges();

      // act
      component.ngOnInit();

      // assert
      expect(component.onUpdate).toBeTruthy();
      expect(component.sessionForm?.value).toEqual({
        name: 'Test Session',
        date: '2025-01-01',
        teacher_id: 2,
        description: 'Test Description'
      });
      expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    });

    it('should redirect to sessions if user is not admin', () => {
      // arrange
      mockSessionService.sessionInformation.admin = false;
      fixture.detectChanges();

      // act
      component.ngOnInit();

      // assert
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    });
  });

  describe('Form submission', () => {

    it('should create a new session when in create mode', () => {
      // arrange
      const exitPageSpy = jest.spyOn(component as any, 'exitPage');
      mockRouter.url = '/sessions/create';
      fixture.detectChanges();

      component.ngOnInit();
      component.sessionForm?.setValue(mockNewSession);

      // act
      component.submit();

      // assert
      expect(mockSessionApiService.create).toHaveBeenCalledWith(mockNewSession);
      expect(mockSessionApiService.create).toHaveBeenCalledTimes(1);
      expect(exitPageSpy).toHaveBeenCalledWith('Session created !');
    });

    it('should update existing session when in update mode', () => {
      // arrange
      const exitPageSpy = jest.spyOn(component as any, 'exitPage');
      mockRouter.url = '/sessions/update/1';
      fixture.detectChanges();

      component.ngOnInit();
      component.sessionForm?.setValue(mockUpdateSession);

      // act
      component.submit();

      // assert
      expect(mockSessionApiService.update).toHaveBeenCalledWith(
        mockSession.id.toString(),
        mockUpdateSession
      );
      expect(mockSessionApiService.update).toHaveBeenCalledTimes(1);
      expect(exitPageSpy).toHaveBeenCalledWith('Session updated !');
    });

  });

  describe('Form validation', () => {

    beforeEach(() => {
      mockRouter.url = '/sessions/create';
      fixture.detectChanges();
      component.ngOnInit();
    });

    it('should mark form as invalid when required fields are empty', () => {
      // arrange
      const form = component.sessionForm;

      // act
      form?.patchValue({
        name: '',
        description: '',
        date: '',
        teacher_id: ''
      });

      // assert
      expect(form?.invalid).toBeTruthy();
    });

    it('should mark form as valid when all required fields are filled', () => {
      // arrange
      const form = component.sessionForm;

      // act
      form?.patchValue({
        name: 'Valid Session',
        description: 'Valid Description',
        date: '2025-01-01',
        teacher_id: 1
      });

      // assert
      expect(form?.valid).toBeTruthy();
    });
  });

});
