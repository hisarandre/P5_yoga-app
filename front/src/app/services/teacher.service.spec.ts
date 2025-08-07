import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';
import { expect } from '@jest/globals';

describe('TeacherService', () => {
  let httpMock: HttpTestingController;
  let teacherService: TeacherService;

  const mockTeacher: Teacher = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15')
  };

  const mockTeachers: Teacher[] = [
    mockTeacher,
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      createdAt: new Date('2025-01-02'),
      updatedAt: new Date('2025-01-16')
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeacherService]
    });

    teacherService = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(teacherService).toBeTruthy();
  });

  it('should call all and return teachers array', () => {
    teacherService.all().subscribe(response => {
      expect(response).toEqual(mockTeachers);
      expect(response.length).toBe(2);
    });

    const req = httpMock.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers);
  });

  it('should call detail and return teacher', () => {
    const teacherId = '1';

    teacherService.detail(teacherId).subscribe(response => {
      expect(response).toEqual(mockTeacher);
    });

    const req = httpMock.expectOne(`api/teacher/${teacherId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTeacher);
  });
});
