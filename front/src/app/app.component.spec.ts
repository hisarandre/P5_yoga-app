import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { AuthService } from './features/auth/services/auth.service';
import { SessionService } from './services/session.service';

const mockSessionService = {
  $isLogged: jest.fn(),
  logOut: jest.fn()
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let sessionService: jest.Mocked<SessionService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService) as jest.Mocked<SessionService>;

    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('login', () => {
    it('should return true if user is logged in', () => {
      sessionService.$isLogged.mockReturnValue(of(true));

      const result = component.$isLogged();

      result.subscribe(isLogged => {
        expect(isLogged).toBe(true);
      });
    });

    it('should return false when user is not logged in', () => {
      sessionService.$isLogged.mockReturnValue(of(false));

      const result = component.$isLogged();

      result.subscribe(isLogged => {
        expect(isLogged).toBe(false);
      });
    });
  });

  describe('logout', () => {
    it('should call sessionService.logOut and navigate to home', () => {
      component.logout();

      expect(sessionService.logOut).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['']);
    });
  });
});
