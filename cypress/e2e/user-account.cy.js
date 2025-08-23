describe("Sign In and Sign Out", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8888/account");
  });

  // Sign in
  it("signs user in", () => {
    cy.logout();

    cy.get('[data-cy="btn-google-sign-in"]').should("be.enabled");
    cy.window().then((win) => {
      cy.stub(win, "open").as("windowOpen");
    });
    cy.get('[data-cy="btn-google-sign-in"]').click();
    cy.get("@windowOpen").should("be.called");
    cy.loginWithToken();
    cy.visit("http://localhost:8888/");
    cy.contains("Welcome").should("be.visible");
  });

  // Sign out
  it("signs user out", () => {
    cy.loginWithToken();

    cy.get('[data-cy="btn-user-menu"]').should("be.visible").click();
    cy.get('[data-cy="user-menu"]').should("be.visible");
    cy.get('[data-cy="btn-signout"]').should("be.visible").click();

    // Confirm logout
    cy.url().should("include", "/login");
  });
});

describe("User Account", () => {
  beforeEach(() => {
    cy.loginWithToken();
    cy.visit("http://localhost:8888/account");
  });

  // View user account page and information
  it("views user account", () => {
    cy.get('[data-cy="sct-account-info"]').within(() => {
      cy.contains("Name").should("be.visible");
      cy.contains("Email").should("be.visible");
      cy.contains("Nowably User ID").should("be.visible");
    });
    cy.get('[data-cy="sct-account-deletion"]').within(() => {
      cy.get('[data-cy="btn-delete-account"]')
        .should("be.visible")
        .should("be.enabled")
        .click();
    });
    cy.get('[data-cy="modal-btn-primary"]').should("be.enabled");
  });
});
