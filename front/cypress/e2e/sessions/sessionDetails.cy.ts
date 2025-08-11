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

  // tests
  beforeEach(() => {
    cy.fixture('teacher').as('teacher');
    cy.fixture('user').as('user');
    cy.fixture('admin').as('admin');
    cy.fixture('sessionWithoutAttendee').as('sessionWithoutAttendee');
    cy.fixture('sessionWithAttendee').as('sessionWithAttendee');

    cy.get('@teacher').then((teacher) => {
      cy.intercept('GET', `${urls.teacherApi}/1`, teacher).as('getTeacher');
    });
  });

  it('Non-attendee successfully participate to a session', () => {
    cy.get('@sessionWithoutAttendee').then((sessionWithoutAttendee: Session) => {
      cy.get('@sessionWithAttendee').then((sessionWithAttendee: Session) => {

        // arrange
        cy.intercept('GET', `${urls.sessionApi}/1`, sessionWithoutAttendee).as('getSessionDetail');
        cy.intercept('POST', `${urls.sessionApi}/1/participate/2`, { statusCode: 200 }).as('participateInSession');

        // User login and navigate to the session detail
        cy.userLogin();
        cy.get(selectors.sessionDetailButton).click();

        cy.url().should('include', '/sessions/detail/1');
        cy.wait('@getSessionDetail');
        cy.wait('@getTeacher');

        cy.get(selectors.participateButton).should('exist').should('be.visible');
        cy.get(selectors.unparticipateButton).should('not.exist');
        cy.get(selectors.attendeesCount).should('contain.text', '0 attendees');

        cy.intercept('GET', '/api/session/1', sessionWithAttendee).as('getSessionDetailAfterParticipate');

        // act
        // User click on participate button
        cy.get(selectors.participateButton).click();

        cy.wait('@getSessionDetailAfterParticipate');

        // assert
        cy.get(selectors.participateButton).should('not.exist');
        cy.get(selectors.unparticipateButton).should('be.visible');
        cy.get(selectors.attendeesCount).should('contain.text', '1 attendees');
      });
    });
  });
});
