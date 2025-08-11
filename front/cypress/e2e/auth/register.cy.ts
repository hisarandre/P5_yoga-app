describe('Register spec', () => {

  // constants
  const urls = {
    registerUrl:'/register',
    loginUrl:'/login',
    registerApi: '/api/auth/register',
  };

  const selectors = {
    emailInput: '[data-testid="email-input"]',
    passwordInput: '[data-testid="password-input"]',
    lastNameInput: '[data-testid="lastname-input"]',
    firstNameInput: '[data-testid="firstname-input"]',
    submitButton: '[data-testid="submit-button"]',
    errorMessage: '[data-testid="error-message"]',
  };

  // data
  const data = {
    validUser: {
      firstName: "Yoga",
      lastName: "Studio",
      email: "yoga@studio.com",
      password: "test!1234"
    },
  };

  // helper functions
  const submitRegisterForm = (firstName, lastName, email, password) => {
    cy.get(selectors.firstNameInput).clear().type(firstName);
    cy.get(selectors.lastNameInput).clear().type(lastName);
    cy.get(selectors.emailInput).clear().type(email);
    cy.get(selectors.passwordInput).clear().type(password);
    cy.get(selectors.submitButton).click();
  };

  // tests
  beforeEach(() => {
    cy.visit(urls.registerUrl)
  })

  it('Register successfull', () => {
    // arrange
    cy.intercept('POST', urls.registerApi, {}).as('registerSuccess')

    // act
    submitRegisterForm(
      data.validUser.firstName,
      data.validUser.lastName,
      data.validUser.email,
      data.validUser.password
    )
    cy.wait('@registerSuccess')

    // assert
    cy.url().should('include', urls.loginUrl)
  })
});
