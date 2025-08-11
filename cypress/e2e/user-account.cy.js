describe("Sign In and Sign Out", () => {
  // Sign in
  it("signs user in", () => {
    cy.logout();

    cy.get('[data-cy="btn-google-sign-in"]', { timeout: 10000 }).should(
      "be.enabled"
    );
    cy.window().then((win) => {
      cy.stub(win, "open").as("windowOpen");
    });
    cy.get('[data-cy="btn-google-sign-in"]').click();
    cy.get("@windowOpen").should("be.called");
    cy.loginWithFirebase();
    cy.visit("http://localhost:8888/");
    cy.contains("Welcome").should("be.visible");
  });

  // Sign out
  it("signs user out", () => {
    cy.loginWithFirebase();
    cy.logout();
  });
});

describe("User Account", () => {
  beforeEach(() => {
    cy.loginWithFirebase();
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
