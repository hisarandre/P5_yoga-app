import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';
import { expect } from '@jest/globals';

describe('SessionApiService', () => {
  let httpMock: HttpTestingController;
  let sessionApiService: SessionApiService;

  const mockSession: Session = {
    id: 1,
    name: 'Yoga Session',
    description: 'A nice yoga session',
    date: new Date('2025-01-15'),
    teacher_id: 1,
    users: []
  };

  const mockSessions: Session[] = [
    mockSession,
    {
      id: 2,
      name: 'Meditation Session',
      description: 'A relaxing meditation session',
      date: new Date('2025-01-16'),
      teacher_id: 2,
      users: []
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionApiService]
    });

    sessionApiService = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(sessionApiService).toBeTruthy();
  });

  it('should fetch all sessions', () => {
    sessionApiService.all().subscribe(response => {
      expect(response).toEqual(mockSessions);
      expect(response.length).toBe(2);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions);
  });

  it('should call detail and return session detail', () => {
    const sessionId = '1';

    sessionApiService.detail(sessionId).subscribe(response => {
      expect(response).toEqual(mockSession);
    });

    const req = httpMock.expectOne(`api/session/${sessionId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  it('should call delete and return void', () => {
    const sessionId = '1';

    sessionApiService.delete(sessionId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`api/session/${sessionId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should call create and return the created session', () => {
    sessionApiService.create(mockSession).subscribe(response => {
      expect(response).toEqual(mockSession);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSession);
    req.flush(mockSession);
  });

  it('should call update and return the updated session', () => {
    const sessionId = '1';
    const updatedSession = { ...mockSession, name: 'Updated Yoga Session' };

    sessionApiService.update(sessionId, updatedSession).subscribe(response => {
      expect(response).toEqual(updatedSession);
    });

    const req = httpMock.expectOne(`api/session/${sessionId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedSession);
    req.flush(updatedSession);
  });

  it('should call participate and return void', () => {
    const sessionId = '1';
    const userId = '123';

    sessionApiService.participate(sessionId, userId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`api/session/${sessionId}/participate/${userId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();
    req.flush(null);
  });

  it('should call unParticipate and return void', () => {
    const sessionId = '1';
    const userId = '123';

    sessionApiService.unParticipate(sessionId, userId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`api/session/${sessionId}/participate/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
