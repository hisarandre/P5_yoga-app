import { Session } from "../../../src/app/features/sessions/interfaces/session.interface";

describe('Session details spec', () => {

  // constants
  const urls = {
    sessionsUrl: '/sessions',
    sessionsDetailUrl: '/sessions/detail/',
    userApi: '/api/user/',
    sessionApi: '/api/session',
    teacherApi: '/api/teacher',
  };

  const selectors = {
    participateButton: '[data-testid="participate-button"]',
    unparticipateButton: '[data-testid="unparticipate-button"]',
    attendeesCount: '[data-testid="attendees-count"]',
    deleteButton: '[data-testid="delete-button"]',
    sessionDetailButton: '[data-testid="detail-button-1"]'
  };

  // Helpers
  const navigateToSessionDetail = (session: Session) => {
    cy.intercept('GET', `${urls.sessionApi}/1`, session).as('getSessionDetail');
    cy.userLogin();
    cy.get(selectors.sessionDetailButton).click();

    cy.url().should('include', '/sessions/detail/1');
    cy.wait('@getSessionDetail');
    cy.wait('@getTeacher');
  };

  const checkSessionState = (expected: {
    isParticipating: boolean;
    attendeesText: string;
  }) => {
    if (expected.isParticipating) {
      cy.get(selectors.participateButton).should('not.exist');
      cy.get(selectors.unparticipateButton).should('be.visible');
    } else {
      cy.get(selectors.participateButton).should('be.visible');
      cy.get(selectors.unparticipateButton).should('not.exist');
    }
    cy.get(selectors.attendeesCount).should('contain.text', expected.attendeesText);
  };

  // Set up
  beforeEach(() => {
    cy.fixture('teachers/teacher').as('teacher');
    cy.fixture('auth/user').as('user');
    cy.fixture('auth/admin').as('admin');
    cy.fixture('sessions/sessionWithoutAttendee').as('sessionWithoutAttendee');
    cy.fixture('sessions/sessionWithAttendee').as('sessionWithAttendee');

    cy.get('@teacher').then((teacher) => {
      cy.intercept('GET', `${urls.teacherApi}/1`, teacher).as('getTeacher');
    });  });

  // tests
  it('Non-attendee successfully participate to a session', () => {
    cy.get('@sessionWithoutAttendee').then((sessionWithoutAttendee: Session) => {
      cy.get('@sessionWithAttendee').then((sessionWithAttendee: Session) => {

        // arrange
        navigateToSessionDetail(sessionWithoutAttendee);
        checkSessionState({ isParticipating: false, attendeesText: '0 attendees' });

        cy.intercept('POST', `${urls.sessionApi}/1/participate/2`, { statusCode: 200 }).as('participateInSession');
        cy.intercept('GET', `${urls.sessionApi}/1`, sessionWithAttendee).as('getSessionDetailAfterParticipate');

        // act
        cy.get(selectors.participateButton).click();
        cy.wait('@getSessionDetailAfterParticipate');

        // assert
        checkSessionState({ isParticipating: true, attendeesText: '1 attendees' });
      });
    });
  });

  it('Attendee successfully unparticipate from a session', () => {
    cy.get('@sessionWithAttendee').then((sessionWithAttendee: Session) => {
      cy.get('@sessionWithoutAttendee').then((sessionWithoutAttendee: Session) => {

        // arrange
        navigateToSessionDetail(sessionWithAttendee);
        checkSessionState({ isParticipating: true, attendeesText: '1 attendees' });

        cy.intercept('DELETE', `${urls.sessionApi}/1/participate/2`, { statusCode: 200 }).as('unparticipateInSession');
        cy.intercept('GET', `${urls.sessionApi}/1`, sessionWithoutAttendee).as('getSessionDetailAfterUnparticipate');

        // act
        cy.get(selectors.unparticipateButton).click();
        cy.wait('@getSessionDetailAfterUnparticipate');

        // assert
        checkSessionState({ isParticipating: false, attendeesText: '0 attendees' });
      });
    });
  });

});
