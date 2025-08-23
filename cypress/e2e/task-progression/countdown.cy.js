describe("Task progress: Countdown view", () => {
  beforeEach(() => {
    cy.loginWithToken();
    cy.visit("http://localhost:8888/");
    cy.createAndStartTask();
  });

  it("views and starts countdown", () => {
    // countdown is visible
    cy.get('[data-cy="anim-task-countdown"]').should("be.visible");

    // countdown is running
    cy.contains("27");
  });

  it("views both action buttons", () => {
    cy.get('[data-cy="btn-need-help"]').should("be.visible").and("be.enabled"); // "i need help" button
    cy.get('[data-cy="btn-task-started"]') // "i started" button
      .should("be.visible")
      .and("be.enabled");
  });
});
