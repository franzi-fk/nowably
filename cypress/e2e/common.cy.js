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

// cookie banner
describe("Cookie banner", () => {
  beforeEach(() => {
    // clear cookies and localStorage to ensure a clean state
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("http://localhost:8888");
  });

  it("shows cookie banner when no respective item in localStorage", () => {
    cy.get('[data-cy="cookie-banner"]').should("be.visible");
    cy.get('[data-cy="btn-cookies-ok"]').should("be.visible").and("be.enabled");
  });

  it("hides banner after clicking okay and persists in localStorage", () => {
    cy.get('[data-cy="btn-cookies-ok"]').click();
    // banner disappears
    cy.get('[data-cy="cookie-banner"]').should("not.exist");
    // value is persisted in localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem("cookieAccepted")).to.eq("true");
    });
    // banner stays hidden on reload
    cy.reload();
    cy.get('[data-cy="cookie-banner"]').should("not.exist");
  });
});
