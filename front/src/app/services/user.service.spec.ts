import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';
import { expect } from '@jest/globals';

describe('UserService', () => {
  let httpMock: HttpTestingController;
  let userService: UserService;

  const mockUser: User = {
    id: 1,
    email: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
    password: '',
    admin: false,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    userService = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

  it('should call getById and return user', () => {
    const userId = '1';

    userService.getById(userId).subscribe(response => {
      expect(response).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`api/user/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should call delete and return void', () => {
    const userId = '1';

    userService.delete(userId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`api/user/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
