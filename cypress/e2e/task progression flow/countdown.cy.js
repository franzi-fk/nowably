describe("Task progress: Countdown view", () => {
  beforeEach(() => {
    cy.loginWithFirebase();
    cy.visit("http://localhost:8888/");
    cy.createAndStartTask();
  });

  it("views and starts countdown", () => {
    // countdown is visible
    cy.get('[data-cy="anim-task-countdown"]').should("be.visible");

    // countdown is running
    cy.contains(/\b(2[6-9]|30)\b/).should("be.visible"); // check for number 26-29
    cy.wait(6000);
    cy.contains(/\b([0-9]|1[0-9]|2[0-5])\b/).should("be.visible"); // check for number <26
  });
  it("views both action buttons", () => {
    cy.get('[data-cy="btn-need-help"]').should("be.visible").and("be.enabled"); // "i need help" button
    cy.get('[data-cy="btn-task-started"]') // "i started" button
      .should("be.visible")
      .and("be.enabled");
  });
});
