// login persistence
describe("Login persistence", () => {
  beforeEach(() => {
    // clear cookies and localStorage to ensure a clean state
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it("persists login across page reloads", () => {
    // login
    cy.loginWithFirebase();
    cy.visit("http://localhost:8888");

    // reload page
    cy.reload();

    // check that user is still logged in
    cy.url().should("not.include", "/login");
    cy.contains("Welcome");
  });
});
