
// Constants
const urls = {
  loginUrl: '/login',
  sessionUrl: '/sessions',
  loginApi: '/api/auth/login',
  sessionApi: '/api/session',
};

const selectors = {
  emailInput: '[data-testid="email-input"]',
  passwordInput: '[data-testid="password-input"]',
  submitButton: '[data-testid="submit-button"]',
  errorMessage: '[data-testid="error-message"]',
};

const data = {
  validUser: {
    email: 'yoga@studio.com',
    password: 'test!1234',
  },
};

// Helper functions
const submitLoginForm = (email, password) => {
  cy.get(selectors.emailInput).clear().type(email);
  cy.get(selectors.passwordInput).clear().type(password);
  cy.get(selectors.submitButton).click();
};

const login = (fixtureName, alias) => {
  cy.visit(urls.loginUrl);

  cy.fixture(fixtureName).then((response) => {
    cy.fixture('sessions').as('sessions');

    cy.get('@sessions').then((sessions) => {
      cy.intercept('GET', urls.sessionApi, sessions).as('getSessions');
    });
    cy.intercept('POST', urls.loginApi, response).as(alias);

    submitLoginForm(data.validUser.email, data.validUser.password);

    cy.wait(`@${alias}`);
    cy.wait('@getSessions');
  });

  cy.url().should('include', urls.sessionUrl);
};

// Commands
Cypress.Commands.add('adminLogin', () => {
  login('adminLoginResponse', 'adminLogin');
});

Cypress.Commands.add('userLogin', () => {
  login('userLoginResponse', 'userLogin');
});
