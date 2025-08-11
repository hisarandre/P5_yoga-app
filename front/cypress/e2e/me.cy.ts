describe('Account spec', () => {

  // constant
  const urls = {
    userApi:'/api/user/',
    sessionApi: '/api/session',
  };

  const selectors = {
    accountButton: '[data-testid="account-button"]',
    adminMessage: '[data-testid="admin-message"]',
    deleteAccountButton: '[data-testid="delete-account-button"]',
  };

  it('Account admin successfull', () => {
    // arrange
    cy.intercept({method: 'GET', url: urls.sessionApi },[]).as('session')
    cy.adminLogin();

    // act
    cy.fixture('admin').then((admin) => {
      cy.intercept({method: 'GET', url: urls.userApi + '1'}, admin).as('adminUser')
    })

    cy.get(selectors.accountButton).click()

    // assert
    cy.get(selectors.adminMessage).contains('You are admin')
    cy.get(selectors.deleteAccountButton).should('not.exist');

  })

  it('Account user successful', () => {
    // arrange
    cy.intercept('GET', urls.sessionApi, []).as('session');
    cy.userLogin();

    // act
    cy.fixture('user').then((user) => {
      cy.intercept('GET', urls.userApi + '2', user).as('userRequest');
    });

    cy.get(selectors.accountButton).click();

    // assert
    cy.get(selectors.deleteAccountButton).contains('Detail');
    cy.get(selectors.adminMessage).should('not.exist');
  })
});
