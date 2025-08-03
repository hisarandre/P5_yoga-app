import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {expect, it} from '@jest/globals';
import {SessionService} from 'src/app/services/session.service';
import {SessionApiService} from '../../services/session-api.service';

import {FormComponent} from './form.component';
import {of} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }

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

  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of(mockSession)),
    create: jest.fn().mockReturnValue(of(mockNewSession)),
    update: jest.fn().mockReturnValue(of(mockUpdateSession))
  }

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue(mockSession.id.toString())
      },
      root: {}
    }
  };

  const mockRouter = {
    navigate: jest.fn(),
    url: '/sessions/create'
  };

  beforeEach(async () => {
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
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ],
      declarations: [FormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    mockRouter.url = '/sessions/create';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('Form session', () => {
    it('should init form on create mode', () => {
      component.ngOnInit();

      expect(component.onUpdate).toBeFalsy();
      expect(component.sessionForm?.value).toEqual({
        name: '',
        date: '',
        teacher_id: '',
        description: ''
      });
    });

    it('should init form on update mode', () => {
      mockRouter.url = '/sessions/update/1';

      component.ngOnInit();

      expect(component.onUpdate).toBeTruthy();
      expect(component.sessionForm?.value).toEqual({
        name: 'Test Session',
        date: '2025-01-01',
        teacher_id: 2,
        description: 'Test Description'
      });
    });

    it('should create a new session on submit', () => {
      const exitPageSpy = jest.spyOn(component as any, 'exitPage');

      component.ngOnInit();
      component.sessionForm?.setValue(mockNewSession);
      component.submit();

      expect(mockSessionApiService.create).toHaveBeenCalled();
      expect(exitPageSpy).toHaveBeenCalledWith('Session created !');
    });

    it('should update an existing session on submit', () => {
      mockRouter.url = '/sessions/update/1';
      const exitPageSpy = jest.spyOn(component as any, 'exitPage');

      component.ngOnInit();
      component.sessionForm?.setValue(mockUpdateSession);
      component.submit();

      expect(mockSessionApiService.update).toHaveBeenCalledWith(mockSession.id.toString(), mockUpdateSession);
      expect(exitPageSpy).toHaveBeenCalledWith('Session updated !');
    });

    it('should redirect if user is not admin', () => {
      mockSessionService.sessionInformation.admin = false;

      component.ngOnInit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    });
  });
});
