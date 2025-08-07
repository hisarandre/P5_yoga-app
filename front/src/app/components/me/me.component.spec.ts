import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';

import { MeComponent } from './me.component';
import { User } from '../../interfaces/user.interface';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';

const mockSessionService = {
  sessionInformation: {
    admin: true,
    id: 1
  },
  logOut: jest.fn()
};

const mockUserService = {
  getById: jest.fn(),
  delete: jest.fn()
};

const mockMatSnackBar = {
  open: jest.fn()
};

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>
  let htmlElement: HTMLElement;
  let router: Router;
  let sessionService: jest.Mocked<SessionService>;
  let userService: jest.Mocked<UserService>;
  let matSnackBar: jest.Mocked<MatSnackBar>;

  const mockUser: User = {
    id: 1,
    email: 'test@test.com',
    lastName: 'Test',
    firstName: 'User',
    admin: true,
    password: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        RouterTestingModule,
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: MatSnackBar, useValue: mockMatSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    htmlElement = fixture.nativeElement;
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService) as jest.Mocked<SessionService>;
    userService = TestBed.inject(UserService) as jest.Mocked<UserService>;
    matSnackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;

    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fetch user information', () => {
    it('should fetch user information on init', () => {
      userService.getById.mockReturnValue(of(mockUser));

      component.ngOnInit();

      expect(userService.getById).toHaveBeenCalledWith('1');
      expect(userService.getById).toHaveBeenCalledTimes(1);
      expect(component.user).toEqual(mockUser);
    });

    it('should display user information when user is loaded', () => {
      userService.getById.mockReturnValue(of(mockUser));

      component.ngOnInit();
      fixture.detectChanges();

      expect(htmlElement.textContent).toContain('User TEST');
      expect(htmlElement.textContent).toContain('test@test.com');
      expect(htmlElement.textContent).toContain('Create at:');
      expect(htmlElement.textContent).toContain('Last update:');
    });

    it('should show admin message when user is admin', () => {
      const admin = { ...mockUser, admin: true };
      userService.getById.mockReturnValue(of(admin));

      component.ngOnInit();
      fixture.detectChanges();

      expect(htmlElement.textContent).toContain('You are admin');
    });

    it('should show delete button when user is not admin', () => {
      const user = { ...mockUser, admin: false };
      userService.getById.mockReturnValue(of(user));

      component.ngOnInit();
      fixture.detectChanges();

      expect(htmlElement.textContent).toContain('Delete my account:');

      const deleteButton = htmlElement.querySelector('button[color="warn"]')!;
      expect(deleteButton).toBeTruthy();
      expect(deleteButton.textContent!.trim()).toContain('Detail');
    });

    it('should not show delete button when user is admin', () => {
      const adminUser = { ...mockUser, admin: true };
      userService.getById.mockReturnValue(of(adminUser));

      component.ngOnInit();
      fixture.detectChanges();

      expect(htmlElement.textContent).not.toContain('Delete my account:');

      const deleteButton = htmlElement.querySelector('button[color="warn"]');
      expect(deleteButton).toBeFalsy();
    });
  });

  describe('Navigation', () => {
    it('should navigate back on back method call', () => {
      const backSpy = jest.spyOn(window.history, 'back');

      component.back();

      expect(backSpy).toHaveBeenCalled();
    });
  })

  describe('delete user', () => {
    it('should call delete() when delete button is clicked', () => {
      const deleteSpy = jest.spyOn(component, 'delete');
      const regularUser = { ...mockUser, admin: false };
      userService.getById.mockReturnValue(of(regularUser));
      userService.delete.mockReturnValue(of({}));

      component.ngOnInit();
      fixture.detectChanges();

      const deleteButton = htmlElement.querySelector('button[color="warn"]') as HTMLElement;
      deleteButton.click();

      expect(deleteSpy).toHaveBeenCalledTimes(1);
    });

    it('should show success message after user deleted', () => {
      userService.delete.mockReturnValue(of({}));

      component.delete();

      expect(matSnackBar.open).toHaveBeenCalledTimes(1)
    });

    it('should log out user after user deleted', () => {
      userService.delete.mockReturnValue(of({}));

      component.delete();

      expect(sessionService.logOut).toHaveBeenCalledTimes(1);
    });

    it('should navigate to home after successful deletion', () => {
      userService.delete.mockReturnValue(of({}));

      component.delete();

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

  });
});
