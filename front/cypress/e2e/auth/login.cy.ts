describe('Login spec', () => {

  // constants
  const urls = {
    loginUrl:'/login',
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

  // data
  const data = {
    validUser: {
      email: "yoga@studio.com",
      password: "test!1234"
    },
    wrongUser: {
      email: "invalidLogin@test.com",
      password: "invalidPassword"
    }
  };

  // helper functions
  const submitLoginForm = (email, password) => {
    cy.get(selectors.emailInput).clear().type(email);
    cy.get(selectors.passwordInput).clear().type(password);
    cy.get(selectors.submitButton).click();
  };

  // tests
  beforeEach(() => {
    cy.visit(urls.loginUrl)
  })

  it('Login successfull', () => {
    // arrange
    cy.fixture('adminLoginResponse').then((admin) => {
      cy.intercept('POST', urls.loginApi, admin).as('loginSuccess')
    })

    cy.intercept('GET', urls.sessionApi, []).as('session')

    // act
    submitLoginForm(data.validUser.email, data.validUser.password)
    cy.wait('@loginSuccess')
    cy.wait('@session')

    // assert
    cy.url().should('include', urls.sessionUrl)
  })

  it('Login failed', () => {
    // arrange
    cy.intercept('POST', urls.loginApi, {
      statusCode: 401,
      body: {
        error: 'Invalid credentials'
      }
    }).as('invalidLogin')

    // act
    submitLoginForm(data.wrongUser.email, data.wrongUser.password)
    cy.wait('@invalidLogin')

    // assert
    cy.url().should('include', urls.loginUrl)
    cy.get(selectors.errorMessage).should('be.visible').and('contain', 'An error occurred')
  })

});
