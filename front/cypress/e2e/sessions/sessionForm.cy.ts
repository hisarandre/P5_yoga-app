describe('Session form spec', () => {

  // constants
  const urls = {
    sessionsUrl: '/sessions',
    sessionsCreateUrl: '/sessions/create',
    sessionsUpdateUrl: '/sessions/update',
    sessionApi: '/api/session',
    teacherApi: '/api/teacher',
  };

  const selectors = {
    createSessionButton: '[data-testid="create-session-button"]',
    editSessionButton: '[data-testid="edit-session-button-1"]',
    nameInput: '[data-testid="name-input"]',
    dateInput: '[data-testid="date-input"]',
    teacherSelect: '[data-testid="teacher-input"]',
    descriptionInput: '[data-testid="description-input"]',
    submitButton: '[data-testid="submit-button"]',
  };

  // Helper functions
  const navigateToCreateForm = () => {
    cy.get(selectors.createSessionButton).click();
    cy.url().should('include', urls.sessionsCreateUrl);
    cy.wait('@getTeachers');
  };

  const navigateToUpdateForm = () => {
    cy.get(selectors.editSessionButton).click();
    cy.url().should('include', '/sessions/update/1');
    cy.wait('@getSessionDetail');
    cy.wait('@getTeachers');
  };

  const fillSessionForm = (sessionData) => {
    cy.get(selectors.nameInput).clear().type(sessionData.name);
    cy.get(selectors.dateInput).clear().type(sessionData.date);
    cy.get(selectors.descriptionInput).clear().type(sessionData.description);

    cy.get(selectors.teacherSelect).click();
    if (sessionData.teacher_id === 1) {
      cy.get('mat-option').first().click();
    } else {
      cy.get('mat-option').eq(sessionData.teacher_id - 1).click();
    }
  };

  // set up
  beforeEach(() => {
    cy.fixture('teachers/teachers').then((teachers) => {
      cy.intercept('GET', urls.teacherApi, teachers).as('getTeachers');
    });
  });

  // tests
  it('Admin create successfully a new session', () => {
    // arrange
    cy.fixture('sessions/sessionWithoutAttendee').then((testData) => {
      cy.intercept('POST', urls.sessionApi, {
        statusCode: 200,
        body: testData
      }).as('createSession');

      // act
      cy.adminLogin();
      navigateToCreateForm();

      cy.contains('Create session').should('be.visible');

      fillSessionForm(testData);
      cy.get(selectors.submitButton).should('not.be.disabled').click();

      // assert
      cy.wait('@createSession').then((interception) => {
        expect(interception.request.body).to.include({
          name: testData.name,
          date: testData.date,
          description: testData.description,
          teacher_id: testData.teacher_id
        });
      });

      cy.contains('Session created !').should('be.visible');
      cy.url().should('include', urls.sessionsUrl);
    });
  });

  it('Admin update successfully an existing session', () => {
    cy.fixture('sessions/existingSession').then((existingSession) => {
      cy.fixture('sessions/updatedSession').then((updatedSession) => {
        // arrange
        cy.intercept('GET', `${urls.sessionApi}/1`, existingSession).as('getSessionDetail');
        cy.intercept('PUT', `${urls.sessionApi}/1`, {
          statusCode: 200,
          body: { ...existingSession, ...updatedSession }
        }).as('updateSession');

        // act
        cy.adminLogin();
        navigateToUpdateForm();

        cy.contains('Update session').should('be.visible');
        cy.get(selectors.nameInput).should('have.value', existingSession.name);
        cy.get(selectors.dateInput).should('have.value', existingSession.date);
        cy.get(selectors.descriptionInput).should('have.value', existingSession.description);

        fillSessionForm(updatedSession);
        cy.get(selectors.submitButton).should('not.be.disabled').click();

        // assert
        cy.wait('@updateSession').then((interception) => {
          expect(interception.request.body).to.include({
            name: updatedSession.name,
            date: updatedSession.date,
            description: updatedSession.description,
            teacher_id: updatedSession.teacher_id
          });
        });

        cy.contains('Session updated !').should('be.visible');
        cy.url().should('include', urls.sessionsUrl);
      });
    });
  });

});
