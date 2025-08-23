const BASE_URL = "http://localhost:8888";

describe("Navigation in task progression flow", () => {
  beforeEach(() => {
    cy.loginWithToken();
    cy.visit(`${BASE_URL}`);
    cy.createAndStartTask();
  });

  it("navigates to home page when clicking x icon", () => {
    cy.get('[data-cy="initiate-stopping-task"]').click();
    cy.get('[data-cy="modal-btn-primary"]').click();
    // ensure we are back on home
    cy.url().should("include", "/");
    cy.contains("Welcome").should("be.visible");
  });

  it("navigates to home page when clicking 'back to home' button on success page", () => {
    cy.get('[data-cy="btn-task-started"]').click();
    cy.get('[data-cy="btn-stop-task"]').click();
    cy.get('[data-cy="radio-task-completed"]').click();
    cy.get('[data-cy="btn-save-continue"]').click();
    cy.get('[data-cy="btn-back-home"]').click();
    // ensure we are back on home
    cy.url().should("include", "/");
    cy.contains("Welcome").should("be.visible");
  });

  it("navigates back to 'countdown' view from 'need help' overview", () => {
    // open 'need help' overview
    cy.get('[data-cy="btn-need-help"]').click();
    // click back button
    cy.get('[data-cy="btn-go-back"]').click();
    // ensure we are back on 'Countdown' view
    cy.url().should("include", "/countdown");
    cy.get('[data-cy="btn-need-help"]').should("be.visible");
  });

  const helpSubViews = ["demotivated", "overwhelmed", "anxious"];

  it("navigates back to 'need help' overview from each help sub view (go back)", () => {
    // open 'need help' overview
    cy.get('[data-cy="btn-need-help"]').click();

    helpSubViews.forEach((subView) => {
      // navigate into subview
      cy.get(`[data-cy="btn-${subView}"]`).click();

      // click back button
      cy.get('[data-cy="btn-go-back"]').click();

      // ensure we are back on 'need help' overview
      helpSubViews.forEach((currentSubView) => {
        cy.get(`[data-cy="btn-${currentSubView}"]`).should("be.visible");
      });
    });
  });

  it("navigates to 'after help' view from each help sub view (skip)", () => {
    helpSubViews.forEach((subView) => {
      // open 'need help' overview
      cy.get('[data-cy="btn-need-help"]').click();

      // navigate into subview
      cy.get(`[data-cy="btn-${subView}"]`).click();

      // click back button
      cy.get('[data-cy="btn-skip"]').click();

      // ensure we are on 'after help' view where user is asked whether to continue with task or not
      cy.url().should("include", "/task-continue");
      cy.get('[data-cy="sct-after-help-view"]').should("be.visible");

      // go back to 'need help overview'
      cy.get('[data-cy="btn-continue"]').click();
    });
  });

  it("navigates back to 'demotivated' and 'anxious' sub view from 'after help' view", () => {
    // open 'need help' overview
    cy.get('[data-cy="btn-need-help"]').click();

    const helpSubViewsToComeBackTo = ["demotivated", "anxious"]; // going back after task splitting (action for overwhelmed) is not possible

    helpSubViewsToComeBackTo.forEach((subView) => {
      // navigate into subview
      cy.get(`[data-cy="btn-${subView}"]`).click();

      // click back button
      cy.get('[data-cy="btn-skip"]').click();

      // ensure we are on 'after help' view where user is asked whether to continue with task or not
      cy.url().should("include", "/task-continue");
      cy.get('[data-cy="sct-after-help-view"]').should("be.visible");

      // go back
      cy.get('[data-cy="btn-go-back"]').click();

      // ensure we are back on help sub view
      cy.get(
        '[data-cy="art-motivation-alt"], [data-cy="art-receive-mebo"], [data-cy="art-relaxation-exercise"]'
      ).should("be.visible"); // if one of them is found > success

      // go back to 'need help' overview
      cy.get('[data-cy="btn-go-back"]').click();
    });
  });
});
