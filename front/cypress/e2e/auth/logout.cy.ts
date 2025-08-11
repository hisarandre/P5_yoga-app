describe('Logout spec', () => {

  // constants
  const urls = {
    sessionUrl: '/sessions',
    loginUrl: '/login',
    sessionApi: '/api/session'
  };

  const selectors = {
    logoutButton: '[data-testid="logout-button"]',
  };

  // tests
  beforeEach(() => {
    cy.fixture('sessions').then((sessions) => {
      cy.intercept('GET', urls.sessionApi, sessions).as('sessions')
    })

    cy.userLogin();
  });

  it('Logout successfull', () => {
    // act
    cy.get(selectors.logoutButton).click()

    // asset
    cy.url().should('include', '')
  });
});
