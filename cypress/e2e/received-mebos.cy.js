describe("Received Messages in a Bottle", () => {
  beforeEach(() => {
    cy.task("resetTestUser"); // reset so there are no received mebos initially
    cy.loginWithToken();
    cy.visit("http://localhost:8888/");
  });

  it("views empty state when user has no received mebos yet", () => {
    cy.visit("http://localhost:8888/received-messages");
    cy.get('[data-cy="empty-state"]').should("be.visible");
  });

  it("views mebos the user has received", () => {
    cy.receiveMebo();
    cy.visit("http://localhost:8888/received-messages");
    cy.get('[data-cy="mebo-text"]').should("be.visible");
  });

  it("does not view received mebo banner on home when user no received mebos", () => {
    cy.get('[data-cy="art-received-mebos-banner"]').should("not.exist");
  });

  it("views received mebo banner on home when user has at least 1 received mebo", () => {
    cy.receiveMebo();
    cy.get('[data-cy="art-received-mebos-banner"]').should("be.visible");
  });
});
