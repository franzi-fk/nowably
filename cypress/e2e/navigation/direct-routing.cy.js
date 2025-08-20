// routes
describe("Direct routing", () => {
  const BASE_URL = "http://localhost:8888";

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  context("Public pages", () => {
    beforeEach(() => {
      cy.logout();
    });

    it("directly visits login page", () => {
      cy.visit(`${BASE_URL}`);
      cy.wait(1000);
      cy.url().should("include", "/login");
    });

    it("directly visits terms of use page", () => {
      cy.visit(`${BASE_URL}/terms-of-use`);
      cy.url().should("include", "/terms-of-use");
      cy.get("h1").should("contain", "Terms of Use");
    });

    it("directly visits privacy policy page", () => {
      cy.visit(`${BASE_URL}/privacy`);
      cy.url().should("include", "/privacy");
      cy.get("h1").should("contain", "Privacy Policy");
    });

    it("directly visits legal notice page", () => {
      cy.visit(`${BASE_URL}/legal-notice`);
      cy.url().should("include", "/legal-notice");
      cy.get("h1").should("contain", "Legal Notice");
    });
  });

  context("Protected pages (requires auth)", () => {
    const protectedPages = [
      { path: "/", headline: "Welcome" },
      { path: "/all-tasks", headline: "All Tasks" },
      { path: "/completion-cards", headline: "Completion Cards" },
      {
        path: "/send-message-in-bottle",
        headline: "Send a Message in a Bottle",
      },
      { path: "/received-messages", headline: "Received Messages in a Bottle" },
      { path: "/account", headline: "Account" },
    ];

    protectedPages.forEach((page) => {
      it(`redirects to login if unauthenticated for ${page.path}`, () => {
        cy.logout();
        cy.visit(`${BASE_URL}${page.path}`, { failOnStatusCode: false });
        cy.url().should("include", "/login");
      });

      it(`allows access when logged in for ${page.path}`, () => {
        cy.loginWithFirebase();
        cy.visit(`${BASE_URL}${page.path}`);
        cy.contains(page.headline).should("be.visible");
      });
    });
  });
});
