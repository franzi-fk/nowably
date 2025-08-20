// invalid URL (404)
describe("404 / Invalid URL handling", () => {
  it("redirects to 404 page for unknown URLs", () => {
    cy.visit("http://localhost:8888/this-page-does-not-exist", {
      failOnStatusCode: false,
    });

    // check content and click 'go home' button
    cy.get('[data-cy="404-page"]').should("be.visible");
    cy.get('[data-cy="btn-go-home"]')
      .should("be.visible")
      .and("be.enabled")
      .click();

    // confirm we are on home page
    cy.contains("Welcome");
  });
});
