import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';
import { expect } from '@jest/globals';

describe('SessionService', () => {
  let sessionService: SessionService;

  const mockSessionInformation: SessionInformation = {
    token: 'abc',
    type: 'Bearer',
    id: 1,
    username: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
    admin: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionService]
    });
    sessionService = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(sessionService).toBeTruthy();
  });

  it('should return an observable of isLogged status', () => {
    sessionService.$isLogged().subscribe(isLogged => {
      expect(isLogged).toBe(false);
    });
  });

  it('should log in user and update state', () => {
    sessionService.logIn(mockSessionInformation);

    expect(sessionService.isLogged).toBe(true);
    expect(sessionService.sessionInformation).toEqual(mockSessionInformation);
    expect(sessionService.sessionInformation).toBe(mockSessionInformation);
  });

  it('should emit true when user is logged in', () => {
    let isLoggedValue: boolean | undefined;

    sessionService.$isLogged().subscribe(isLogged => {
      isLoggedValue = isLogged;
    });

    sessionService.logIn(mockSessionInformation);

    expect(isLoggedValue).toBe(true);
  });

  it('should log out user and update state', () => {
    // First log in
    sessionService.logIn(mockSessionInformation);
    expect(sessionService.isLogged).toBe(true);
    expect(sessionService.sessionInformation).toEqual(mockSessionInformation);

    // Then log out
    sessionService.logOut();

    expect(sessionService.isLogged).toBe(false);
    expect(sessionService.sessionInformation).toBeUndefined();
  });

  it('should emit false when user logs out', () => {
    let isLoggedValue: boolean | undefined;

    // First log in
    sessionService.logIn(mockSessionInformation);

    sessionService.$isLogged().subscribe(isLogged => {
      isLoggedValue = isLogged;
    });

    sessionService.logOut();

    expect(isLoggedValue).toBe(false);
  });

});
