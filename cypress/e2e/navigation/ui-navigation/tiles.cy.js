const BASE_URL = "http://localhost:8888";

function clickViewAllAndVerify({ selector, url, title }) {
  cy.get(selector).within(() => {
    cy.get('[data-cy="btn-view-all"]')
      .should("be.visible")
      .and("be.enabled")
      .click();
  });
  cy.url().should("include", url);
  cy.contains(title).should("be.visible");
}

const TilesWithViewAllBtn = [
  {
    selector: '[data-cy="sct-open-tasks"]',
    url: "/all-tasks",
    title: "All Tasks",
    setup: () => cy.createTask(),
  },
  {
    selector: '[data-cy="completion-cards-tile"]',
    url: "/completion-cards",
    title: "Completion Cards",
  },
  {
    selector: '[data-cy="art-received-mebos-banner"]',
    url: "/received-messages",
    title: "Received Messages in a Bottle",
    setup: () => cy.receiveMebo(),
  },
];

describe("Navigation via tiles on home page", () => {
  beforeEach(() => {
    cy.task("resetTestUser");
    cy.loginWithToken();
    cy.visit(BASE_URL);
  });

  // Tile without "View all" button (entire tile clickable)
  it("navigates to 'Send Message in a Bottle' when clicking tile", () => {
    cy.createAndCompleteTask();
    cy.get('[data-cy="home-mebo-banner"]').should("be.visible").click();
    cy.url().should("include", "/send-message-in-bottle");
    cy.contains("Send a Message in a Bottle").should("be.visible");
  });

  // Loop through all tiles with "View all" button
  TilesWithViewAllBtn.forEach((tile) => {
    it(`navigates to '${tile.title}' when clicking 'View all' on respective tile`, () => {
      tile.setup?.();
      clickViewAllAndVerify(tile);
    });
  });
});
